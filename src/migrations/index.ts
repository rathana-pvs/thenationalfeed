import * as migration_20260624_085723_init from './20260624_085723_init';
import * as migration_20260715_135505_add_og_and_share_links from './20260715_135505_add_og_and_share_links';

export const migrations = [
  {
    up: migration_20260624_085723_init.up,
    down: migration_20260624_085723_init.down,
    name: '20260624_085723_init',
  },
  {
    up: migration_20260715_135505_add_og_and_share_links.up,
    down: migration_20260715_135505_add_og_and_share_links.down,
    name: '20260715_135505_add_og_and_share_links'
  },
];
