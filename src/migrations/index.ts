import * as migration_20261117_190505_initial from './20261117_190505_initial';

export const migrations = [
  {
    up: migration_20261117_190505_initial.up,
    down: migration_20261117_190505_initial.down,
    name: '20261117_190505_initial'
  },
];
