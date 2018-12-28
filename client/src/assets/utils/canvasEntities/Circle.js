export default class Circle {
  constructor(props) {
    this.props = Object.assign({}, props);
  };

  getRenderFunction() {
    return 'renderCircle';
  };
}
