# Cell

Cell is a lightweight, configuration-driven JavaScript Framework Using ECMAScript6, 
for building complete website with **minimal dependencies and no heavy frameworks**.

## Why Cell?

Modern UI frameworks are powerful, but they come with costs:
- Large dependency trees
- Build pipelines and bundlers
- Complex runtime abstractions
- Long-term maintenance overhead

Cell is designed for environments where:
- Dependency minimization matters
- UI requirements are well-defined and controlled
- A full framework is unnecessary or undesirable

## What Cell Is

- A configuration-driven UI renderer
- A small runtime for assembling UI components
- A solution for usually used web component, chart element and data crypto feature
- Framework-agnostic (no React, Vue, Angular)

## What Cell Is Not

- A virtual DOM framework
- A general-purpose SPA framework
- A replacement for React or Vue
- A solution for large, unbounded UI ecosystems

## Design Principles

- **Minimal Dependencies**  
  Cell avoids external frameworks and large libraries by design.

- **Configuration First**  
  UIs are described declaratively using structured configuration instead of JSX or templates.

- **Predictable Rendering**  
  No hidden lifecycle magic. Rendering behavior is explicit and deterministic.

- **Controlled Scope**  
  Cell targets known UI patterns, not arbitrary application logic.

## Core Concepts

- **Cell Definition**  
  A Cell is a declarative description of a UI element.

- **Component Types**  
  Built-in components such as menus, slideshows, message lists, etc.

- **Renderer**  
  Translates Cell configuration into actual DOM output. Add a little attributes to exist DOM element, 
  can enhance exist DOM element support the configuration data.

- **Composition**  
  Cells can be nested to build complete interfaces.
