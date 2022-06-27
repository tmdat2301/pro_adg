import flatten from 'flat';
import translation from './translation.json';
import nav from './nav.json';
import input from './input.json';
import label from './label.json';
import tabbar from './tabbar.json';
import button from './button.json';
import title from './title.json';
import contact from './contact.json';
import business from './business.json';
import error from './error.json';
import lead from './lead.json';
import validate from './validate.json';
import filter from './filter.json';


export default {
  translation: flatten<Record<string, any>, typeof translation>(translation, {
    delimiter: '_',
  }),

  nav: flatten<Record<string, any>, typeof translation>(nav, {
    delimiter: '_',
  }),
  input: flatten<Record<string, any>, typeof translation>(input, {
    delimiter: '_',
  }),

  label: flatten<Record<string, any>, typeof translation>(label, {
    delimiter: '_',
  }),

  tabbar: flatten<Record<string, any>, typeof translation>(tabbar, {
    delimiter: '_',
  }),

  button: flatten<Record<string, any>, typeof translation>(button, {
    delimiter: '_',
  }),

  title: flatten<Record<string, any>, typeof translation>(title, {
    delimiter: '_',
  }),

  contact: flatten<Record<string, any>, typeof translation>(contact, {
    delimiter: '_',
  }),

  business: flatten<Record<string, any>, typeof translation>(business, {
    delimiter: '_',
  }),

  error: flatten<Record<string, any>, typeof translation>(error, {
    delimiter: '_',
  }),

  lead: flatten<Record<string, any>, typeof translation>(lead, {
    delimiter: '_',
  }),

  validate: flatten<Record<string, any>, typeof translation>(validate, {
    delimiter: '_',
  }),

  filter: flatten<Record<string, any>, typeof translation>(filter, {
    delimiter: '_',
  }),
};
