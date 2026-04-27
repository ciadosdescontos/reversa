import { readFileSync, existsSync, mkdirSync, writeFileSync, readdirSync, statSync, unlinkSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { tmpdir } from 'os';

export default async function exportDiagrams(args) {
  const { default: chalk } = await import('chalk');
  const { default: ora } = await import('ora');

  const format = args.find(a => a.startsWith('--format='))?.split('=')[1] || 'svg';
  const customOutput = args.find(a => a.startsWith('--output='))?.split('=')[1];

  if (!['svg', 'png'].includes(format)) {
    console.error(chalk.red(`\n  Formato inválido: "${format}". Use --format=svg ou --format=png\n`));
    process.exit(1);
  }

  const mmdc = findMmdc();
  if (!mmdc) {
    console.log(chalk.yellow('\n  @mermaid-js/mermaid-cli não encontrado.'));
    console.log('  Instale com: ' + chalk.bold('npm install -g @mermaid-js/mermaid-cli'));
    console.log('  Depois execute: ' + chalk.bold('npx reversa export-diagrams\n'));
    process.exit(1);
  }

  const statePath = join(process.cwd(), '.reversa', 'state.json');
  if (!existsSync(statePath)) {
    console.log(chalk.yellow('\n  Reversa não está instalado neste diretório.'));
    console.log('  Execute ' + chalk.bold('npx reversa install') + ' para instalar.\n');
    return;
  }

  const state = JSON.parse(readFileSync(statePath, 'utf8'));
  const outputFolder = state.output_folder || '_reversa_sdd';
  const sddPath = join(process.cwd(), outputFolder);

  if (!existsSync(sddPath)) {
    console.log(chalk.yellow(`\n  Pasta de saída não encontrada: ${outputFolder}`));
    console.log('  Execute os agentes primeiro para gerar os artefatos.\n');
    return;
  }

  const diagramsDir = customOutput
    ? join(process.cwd(), customOutput)
    : join(sddPath, 'diagrams');

  mkdirSync(diagramsDir, { recursive: true });

  const spinner = ora(`Buscando diagramas em ${outputFolder}...`).start();
  const mdFiles = findMdFiles(sddPath);
  const blocks = [];

  for (const file of mdFiles) {
    const content = readFileSync(file, 'utf8');
    const found = extractMermaidBlocks(content);
    if (found.length > 0) {
      const rel = file.replace(sddPath, '').replace(/\\/g, '/').replace(/^\//, '');
      found.forEach((diagram, i) => blocks.push({ diagram, source: rel, index: i }));
    }
  }

  if (blocks.length === 0) {
    spinner.warn('Nenhum diagrama Mermaid encontrado. Execute os agentes primeiro.');
    console.log();
    return;
  }

  spinner.succeed(`${blocks.length} diagrama(s) encontrado(s).`);
  console.log();

  let success = 0;
  let failed = 0;

  for (const { diagram, source, index } of blocks) {
    const baseName = source
      .replace(/\.md$/, '')
      .replace(/\//g, '-')
      .replace(/[^a-zA-Z0-9-_]/g, '_');
    const countForSource = blocks.filter(b => b.source === source).length;
    const suffix = countForSource > 1 ? `-${index + 1}` : '';
    const outName = `${baseName}${suffix}.${format}`;
    const outPath = join(diagramsDir, outName);
    const tmpFile = join(tmpdir(), `reversa-${Date.now()}-${index}.mmd`);
    const spin = ora(`  Exportando ${outName}...`).start();

    try {
      writeFileSync(tmpFile, diagram, 'utf8');
      execSync(`${mmdc} -i "${tmpFile}" -o "${outPath}"`, { stdio: 'pipe' });
      spin.succeed(chalk.hex('#ffa203')(`  ✓ ${outName}`));
      success++;
    } catch (err) {
      spin.fail(chalk.red(`  ✗ ${outName} — ${err.stderr?.toString().split('\n')[0] || err.message}`));
      failed++;
    } finally {
      try { unlinkSync(tmpFile); } catch {}
    }
  }

  console.log();
  console.log(chalk.bold('  Exportação concluída:'));
  console.log(`  ${chalk.hex('#ffa203')(success + ' exportado(s)')}${failed > 0 ? '  ' + chalk.red(failed + ' erro(s)') : ''}`);
  console.log(`  Pasta: ${chalk.cyan(diagramsDir)}\n`);
}

function findMmdc() {
  try {
    execSync('mmdc --version', { stdio: 'pipe' });
    return 'mmdc';
  } catch {}

  const local = join(process.cwd(), 'node_modules', '.bin', 'mmdc');
  if (existsSync(local)) return `"${local}"`;

  return null;
}

function findMdFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...findMdFiles(full));
    } else if (entry.endsWith('.md')) {
      results.push(full);
    }
  }
  return results;
}

function extractMermaidBlocks(content) {
  const regex = /```mermaid\n([\s\S]*?)```/g;
  const blocks = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    blocks.push(match[1].trim());
  }
  return blocks;
}
