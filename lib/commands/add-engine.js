import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { checkExistingInstallation } from '../installer/validator.js';
import { detectEngines, ENGINES } from '../installer/detector.js';
import { Writer } from '../installer/writer.js';
import { loadManifest, saveManifest, buildManifest } from '../installer/manifest.js';
import { applyOrangeTheme, ORANGE_PREFIX } from '../installer/orange-prompts.js';

export default async function addEngine(args) {
  const { default: chalk } = await import('chalk');
  const { default: inquirer } = await import('inquirer');
  applyOrangeTheme();

  const projectRoot = resolve(process.cwd());

  console.log(chalk.bold('\n  Reversa — Adicionar Engine\n'));

  const existing = checkExistingInstallation(projectRoot);
  if (!existing.installed) {
    console.log(chalk.yellow('  Reversa não está instalado neste diretório.'));
    console.log('  Execute ' + chalk.bold('npx reversa install') + ' para instalar.\n');
    return;
  }

  const state = existing.state;

  // Validar campos obrigatórios
  if (!Array.isArray(state.agents) || state.agents.length === 0) {
    console.log(chalk.red('  state.json não tem agentes registrados.'));
    console.log('  Execute ' + chalk.bold('npx reversa install') + ' primeiro.\n');
    return;
  }

  const installedEngineIds = new Set(state.engines ?? []);
  const installedAgents = state.agents;

  const allEngines = detectEngines(projectRoot);
  const notInstalled = allEngines.filter(e => !installedEngineIds.has(e.id));

  if (notInstalled.length === 0) {
    console.log(chalk.hex('#ffa203')('  Todas as engines detectadas já estão configuradas.\n'));
    return;
  }

  const choices = notInstalled.map(e => ({
    name: `${e.name}${e.star ? ' ⭐' : ''}${e.detected ? chalk.gray(' (detectada)') : ''}`,
    value: e.id,
    checked: e.detected,
  }));

  const { selected } = await inquirer.prompt([{
    prefix: ORANGE_PREFIX,
    type: 'checkbox',
    name: 'selected',
    message: 'Selecione as engines a adicionar:',
    choices,
    validate: (v) => v.length > 0 || 'Selecione ao menos uma engine.',
  }]);

  const selectedEngines = ENGINES.filter(e => selected.includes(e.id));
  const writer = new Writer(projectRoot);

  for (const engine of selectedEngines) {
    await writer.installEntryFile(engine);
    for (const agent of installedAgents) {
      await writer.installSkill(agent, engine.skillsDir);
      if (engine.universalSkillsDir && engine.universalSkillsDir !== engine.skillsDir) {
        await writer.installSkill(agent, engine.universalSkillsDir);
      }
    }
    console.log(chalk.hex('#ffa203')(`  ✓  ${engine.name}`));
  }

  // Atualizar state.json
  const statePath = join(projectRoot, '.reversa', 'state.json');
  const s = JSON.parse(readFileSync(statePath, 'utf8'));
  s.engines = [...new Set([...(s.engines ?? []), ...selected])];
  writeFileSync(statePath, JSON.stringify(s, null, 2), 'utf8');

  writer.saveCreatedFiles();

  // Atualizar manifest com caminhos relativos
  const existingManifest = loadManifest(projectRoot);
  const newManifest = buildManifest(projectRoot, writer.manifestPaths);
  saveManifest(projectRoot, { ...existingManifest, ...newManifest });

  console.log(chalk.bold(`\n  ${selected.length} engine(s) adicionada(s) com sucesso.\n`));
}
