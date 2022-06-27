import BaseInput from './BaseInput';
import SearchInput from './SearchInput';
import ArrayField from './MultiInput/ArrayField';

export class MyInput {
  static Base = BaseInput;
  static Search = SearchInput;
  static Multi = ArrayField;
}
