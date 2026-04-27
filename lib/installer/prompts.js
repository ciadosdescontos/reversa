import inquirer from 'inquirer';
import { applyOrangeTheme, ORANGE_PREFIX } from './orange-prompts.js';

applyOrangeTheme();

const REQUIRED_AGENTS = [
  { name: 'Reversa: orquestrador principal', value: 'reversa', disabled: true },
  { name: 'Scout: reconhecimento', value: 'reversa-scout', disabled: true },
  { name: 'Arqueólogo: escavação', value: 'reversa-arqueologo', disabled: true },
  { name: 'Detetive: interpretação', value: 'reversa-detetive', disabled: true },
  { name: 'Arquiteto: síntese arquitetural', value: 'reversa-arquiteto', disabled: true },
  { name: 'Redator: geração de specs', value: 'reversa-redator', disabled: true },
];

const OPTIONAL_AGENTS = [
  { name: 'Revisor: revisão e validação das specs', value: 'reversa-revisor', checked: true },
  { name: 'Tracer: análise dinâmica (requer sistema rodando)', value: 'reversa-tracer', checked: true },
  { name: 'Visor: análise de interface via screenshots', value: 'reversa-visor', checked: true },
  { name: 'Data Master: análise de banco de dados', value: 'reversa-data-master', checked: true },
  { name: 'Design System: tokens de design e temas', value: 'reversa-design-system', checked: true },
];

const P = { prefix: ORANGE_PREFIX };

export async function runInstallPrompts(detectedEngines) {
  const engineChoices = detectedEngines.map(e => ({
    name: `${e.name}${e.star ? ' ⭐' : ''}`,
    value: e.id,
    checked: e.detected,
  }));

  const answers = await inquirer.prompt([
    {
      ...P,
      type: 'checkbox',
      name: 'engines',
      message: 'Quais engines você quer suportar?',
      choices: engineChoices,
      loop: false,
      validate: (selected) => selected.length > 0 || 'Selecione ao menos uma engine.',
    },
    {
      ...P,
      type: 'checkbox',
      name: 'optional_agents',
      message: 'Agentes a instalar:',
      choices: [
        new inquirer.Separator('── Obrigatórios (sempre instalados) ──'),
        ...REQUIRED_AGENTS,
        new inquirer.Separator('── Opcionais ──'),
        ...OPTIONAL_AGENTS,
      ],
      loop: false,
    },
    {
      ...P,
      type: 'input',
      name: 'project_name',
      message: 'Nome deste projeto:',
      default: process.cwd().split(/[\\/]/).pop(),
      validate: (v) => v.trim().length > 0 || 'Nome não pode ser vazio.',
    },
    {
      ...P,
      type: 'input',
      name: 'user_name',
      message: 'Como os agentes devem te chamar?',
      validate: (v) => v.trim().length > 0 || 'Nome não pode ser vazio.',
    },
    {
      ...P,
      type: 'input',
      name: 'chat_language',
      message: 'Idioma para as interações com os agentes:',
      default: 'pt-br',
    },
    {
      ...P,
      type: 'input',
      name: 'doc_language',
      message: 'Idioma dos documentos e especificações gerados:',
      default: 'Português',
    },
    {
      ...P,
      type: 'input',
      name: 'output_folder',
      message: 'Pasta de saída para as especificações:',
      default: '_reversa_sdd',
    },
    {
      ...P,
      type: 'list',
      name: 'git_strategy',
      message: 'Como tratar os artefatos no git?',
      loop: false,
      choices: [
        { name: 'Commitar junto com o projeto (recomendado para equipes)', value: 'commit' },
        { name: 'Adicionar ao .gitignore (uso pessoal)', value: 'gitignore' },
      ],
    },
    {
      ...P,
      type: 'list',
      name: 'answer_mode',
      message: 'Como você prefere responder às perguntas dos agentes?',
      loop: false,
      choices: [
        { name: 'No chat (mais rápido)', value: 'chat' },
        { name: 'No arquivo questions.md (mais organizado)', value: 'file' },
      ],
    },
  ]);

  const requiredAgentValues = REQUIRED_AGENTS.map(a => a.value);
  return {
    ...answers,
    agents: [...requiredAgentValues, ...answers.optional_agents],
  };
}

export async function askMergeStrategy(filePath) {
  const { strategy } = await inquirer.prompt([
    {
      ...P,
      type: 'list',
      name: 'strategy',
      message: `O arquivo "${filePath}" já existe. O que fazer?`,
      loop: false,
      choices: [
        { name: 'Mesclar: adicionar conteúdo do Reversa ao final', value: 'merge' },
        { name: 'Pular: manter o arquivo como está', value: 'skip' },
      ],
    },
  ]);
  return strategy;
}
