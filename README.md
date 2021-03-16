
# React-Scopy-Scroll
An Infinite scope-view-calculated scroll based on react-suctom-scroll package for ReactJS

##### NOT READY FOR PRODUCTION YET ###
<!-- ##### See a [working demo](http://rommguy.github.io/react-scopy-scroll/example/demo.html) ### -->

## Installation
```sh
npm i react-scopy-scroll --save
```

```js
import ScopyScroll from 'react-scopy-scroll';
```
### How to change the design ?
Your own custom design can be applied by styling these 2 classes in your css:

- rcs-custom-scrollbar - this class styles the container of the scroll handle, you can use it if your handle width is greater than the default.
- rcs-inner-handle - this class styles the handle itself, you can use it to change the color, background, border and such of the handle

You can see a usage example in example/firstComp/firstComp.scss

### Custom Scroll Options (react props)

- **allowOuterScroll** : boolean, default false. Blocks outer scroll while scrolling the content
- **heightRelativeToParent** : string, default undefined. Content height limit is relative to parent - the value should be the height limit.
- **flex** : number, default undefined. If present will apply to the content wrapped by the custom scroll.
This prop represents flex size. It is only relevant if the parent of customScroll has display: flex. See example below.
This prop will override any value given to heightRelativeToParent when setting the height of customScroll.
- **onScroll** - function, default undefined. Listener that will be called on each scroll.
- **addScrolledClass** : boolean, default false. If true, will add a css class 'content-scrolled' while being scrolled.
- **freezePosition** : boolean, default false. When true, will prevent scrolling.
- **minScrollHandleHeight** : number, sets the mimimum height of the scroll handle. Default is 38, as in Chrome on OSX.
- **rtl** : boolean, default false. Right to left document, will place the custom scrollbar on the left side of the content, and assume the native one is also there.
- **scrollTo**: number, default undefined. Will scroll content to the given value.
- **keepAtBottom**: boolean, default false. For dynamic content, will keep the scroll position at the bottom of the content, when the content changes, if the position was at the bottom before the change. [See example here](http://rommguy.github.io/react-custom-scroll/example/demo.html?dynamic=true)

##### Example for heightRelativeToParent

```jsx
<CustomScroll heightRelativeToParent="calc(100% - 20px)">
  your content
</CustomScroll>
```

```jsx
<someParent style="display: flex; height: 500px;">
  <fixedHeightElement style="height: 100px"><fixedHeightElement/>
  <ScopyScroll renderItem={(item, index) => {
      return <div key={item.id}>{item.name}</div>
  }}/>
</someParent>
```

### Contributing
To build the project in watch mode, run 'npm run develop' or 'yarn develop'.
For production build - run yarn build .