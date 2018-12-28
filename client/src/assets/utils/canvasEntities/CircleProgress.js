import Circle from './Circle';

export default class CircleProgress extends Circle {
  constructor({ percent = -0.5, width = 2, start = -0.5, ...props }) {
    console.log({ percent, width, start, ...props });
    super({ percent, width, start, ...props });
  };

  getRenderFunction() {
    return 'renderCircleProgress';
  };
}
