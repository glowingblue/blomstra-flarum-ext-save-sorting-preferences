import Dropdown from 'flarum/common/components/Dropdown';
import app from 'flarum/forum/app';
import IndexPage from 'flarum/forum/components/IndexPage';
import { extend } from 'flarum/common/extend';
import type ItemList from 'flarum/common/utils/ItemList';
import type Mithril from 'mithril';
import Button from 'flarum/common/components/Button';

app.initializers.add('blomstra/save-sorting-preferences', () => {
  let sort = app.search.params().sort;

  if (!app.data.session.userId) {
    return;
  }

  extend(IndexPage.prototype, 'viewItems', function (items: ItemList<Mithril.Children>) {
    const sortMap = app.discussions.sortMap();

    if (!sort) {
      sort = app.session.user?.preferences()?.['discussion_sort'];
    }

    const sortOptions = Object.keys(sortMap).reduce((acc: any, sortId) => {
      acc[sortId] = app.translator.trans(`core.forum.index_sort.${sortId}_button`);
      return acc;
    }, {});

    items.setContent(
      'sort',
      <Dropdown
        buttonClassName="Button"
        label={sortOptions[sort] || Object.keys(sortMap).map((key) => sortOptions[key])[0]}
        accessibleToggleLabel={app.translator.trans('core.forum.index_sort.toggle_dropdown_accessible_label')}
      >
        {Object.keys(sortOptions).map((value) => {
          const label = sortOptions[value];
          const active = (sort || Object.keys(sortMap)[0]) === value;

          function handleClick() {
            app.search.changeSort.bind(app.search, value)();
            sort = value;
            app.session.user?.savePreferences({ discussion_sort: value });
          }

          return (
            <Button icon={active ? 'fas fa-check' : true} onclick={handleClick} active={active}>
              {label}
            </Button>
          );
        })}
      </Dropdown>
    );
  });
});
