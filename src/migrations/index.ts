import * as migration_20261117_190505_initial from './20261117_190505_initial';
import * as migration_20261117_200310_billing_dashboards from './20261117_200310_billing_dashboards';

export const migrations = [
  {
    up: migration_20261117_190505_initial.up,
    down: migration_20261117_190505_initial.down,
    name: '20261117_190505_initial',
  },
  {
    up: migration_20261117_200310_billing_dashboards.up,
    down: migration_20261117_200310_billing_dashboards.down,
    name: '20261117_200310_billing_dashboards'
  },
];
