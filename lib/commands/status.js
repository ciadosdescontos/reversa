import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export default async function status(args) {
  const { default: chalk } = await import('chalk');

  const statePath = join(process.cwd(), '.reversa', 'state.json');

  if (!existsSync(statePath)) {
    console.log(chalk.yellow('\n  Reversa não está instalado neste diretório.'));
    console.log('  Execute ' + chalk.bold('npx reversa install') + ' para instalar.\n');
    return;
  }

  const state = JSON.parse(readFileSync(statePath, 'utf8'));

  console.log(chalk.bold('\n  Reversa — Status\n'));
  console.log(`  Projeto:         ${chalk.cyan(state.project || '(não definido)')}`);
  console.log(`  Usuário:         ${chalk.cyan(state.user_name || '(não definido)')}`);
  console.log(`  Versão:          ${chalk.cyan(state.version || '?')}`);
  console.log(`  Fase atual:      ${chalk.cyan(state.phase || 'Não iniciado')}`);
  console.log(`  Idioma chat:     ${chalk.cyan(state.chat_language || 'pt-br')}`);
  console.log(`  Idioma docs:     ${chalk.cyan(state.doc_language || 'pt-br')}`);

  if (state.completed?.length > 0) {
    console.log(`\n  Concluído: ${state.completed.map(f => chalk.hex('#ffa203')('✓ ' + f)).join(', ')}`);
  }
  if (state.pending?.length > 0) {
    console.log(`  Pendente:  ${state.pending.map(f => chalk.gray('○ ' + f)).join(', ')}`);
  }

  console.log();
}
