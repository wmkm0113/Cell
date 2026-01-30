# Cell.js

Cell.js is a lightweight, data-driven JavaScript Framework Using ECMAScript6, 
for building complete website with **minimal dependencies and no heavy frameworks**.

## Why Cell.js?

Modern UI frameworks are powerful, but they come with costs:
- Large dependency trees
- Build pipelines and bundlers
- Complex runtime abstractions
- Long-term maintenance overhead

Cell.js is designed for environments where:
- Dependency minimization matters
- UI requirements are well-defined and controlled
- Using data to build a modern website
- Easy solution for Internationalization support

## What Cell.js Is

- A data-driven UI render
- A small runtime for assembling UI components
- A solution for usually used web component, chart element and data crypto feature
- Framework-agnostic (no React, Vue, Angular)

## What Cell.js Is Not

- A virtual DOM framework
- A replacement for React or Vue
- A solution for large, unbounded UI ecosystems

## Design Principles

- **Minimal Dependencies**  
  Cell.js avoids external frameworks and large libraries by design.

- **Configuration First**  
  UIs are described declaratively using structured configuration instead of JSX or templates.

- **Predictable Rendering**  
  No hidden lifecycle magic. Rendering behavior is explicit and deterministic.

- **Controlled Scope**  
  Cell targets known UI patterns, not arbitrary application logic.

## Core Concepts

- **Cell Definition**  
  A Cell.js is a declarative description of a UI element.

- **Component Types**  
  Built-in components such as menus, slideshows, message lists, details, etc.

- **Renderer**  
  Translates JSON data into actual DOM output. Add a little attributes to exist DOM element, 
  can enhance exist DOM element support the configuration data.

- **Internationalization**  
  Just need two steps to implement internationalization website.

- **Composition**  
  Cells can be nested to build complete interfaces.

- **Security**  
  Support mainstream encryption methods, providing better protection for data security on the internet.

## How to start

If you want try to use Cell.js, just need add one line code in the head tag, replace {version} to the version code you want.
```javascript
<script src="https://cdn.jsdelivr.net/gh/wmkm0113/Cell@{version}/core/Cell.js" type="module"></script>
```

## Should You Use Cell.js?

Use Cell.js if:
- You want a minimal UI runtime
- You control the UI requirements
- You need add the internationalization support for the website

Do not use Cell.js if:
- You need a large ecosystem of third-party components
- You require complex state management
