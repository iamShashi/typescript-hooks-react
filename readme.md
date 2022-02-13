# TypeScript Hooks [React](https://reactjs.org/) &middot; [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://reactjs.org/docs/how-to-contribute.html#your-first-pull-request) [![Up to Date](https://github.com/ikatyang/emoji-cheat-sheet/workflows/Up%20to%20Date/badge.svg)](https://github.com/ikatyang/emoji-cheat-sheet/actions?query=workflow%3A%22Up+to+Date%22)

Typescript-hooks-react is a Typescript based library for Several Hooks.

* **Easy to Configure:** React makes it painless to create interactive UIs. Hooks included are easy to use and configure.
* **Meets Many Usecases:** Hooks included are well versed and suited to a large set of use cases.
* **Include Once and use Anywhere:** These hooks can be use anywhere in your project and hence keeps the project simple.


## Installation

```
npm i typescript-hooks-react --save
```

## Documentation

:hammer_and_wrench: Under Construction. :face_in_clouds:

## Examples

We have several examples. Here is the first one to get you started:

```tsx
import { useKeyPress } from typescript-hooks-react
```

```tsx
const shiftPressed = useKeyPress('Shift');

useEffect(() => {
    dispatch({ type: 'setShiftPressed', payload: shiftPressed });
  }, [shiftPressed]);
```

When Shift :keyboard: is pressed. It dispatches a state change event and the change is updated across the application.


## Contributing

Please follow strict Writing good typescript suggestions. For [example](https://github.com/airbnb/javascript).

Push the code and create a new PR.

Cheers :beers:

### Good First Issues

Please Feel Free to report all the bugs :bug: found whatsoever.

Thanks.

### License

No License.
