# Tokens & Theme Guide

---

## Purpose

This document explains where our **design tokens** come from, how they map into **Tailwind CSS** and **CSS variables**, and how to add or update tokens.  

Design tokens are the **single source of truth** for colours, spacing, typography, radii, elevation, and layout in our app.  
Mapping them correctly ensures consistent styling across components and platforms.

---

## Token Source

Our tokens are defined in `design/design_tokens.json` and published as the package `@bookhood/design-tokens`.  
The file follows the **W3C Design Tokens Community Group (DTCG)** format, with `$value`, `$type`, and `$description` fields.  

It includes:
- **Global tokens** (e.g., spacing scale, radii, typography)  
- **Theme-specific tokens** (light and dark palettes, component colours)  

See `Design_tokens.web_mobile.updated.plus.json` for details.

---

## Mapping Tokens to Tailwind

We extend Tailwind’s default theme in `tailwind.config.ts` to use our tokens.  
Use the `resolveConfig` function or import the JSON directly to generate a theme object.  

Example:

```js
const tokens = require('@bookhood/design-tokens');

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: tokens.light.palette.primary.value,
        'primary-container': tokens.light.palette['primary-container'].value,
        // …map other colours
      },
      spacing: tokens.global.spacing.scale.reduce((acc, value, idx) => {
        acc[idx] = `${value}px`;
        return acc;
      }, {}),
      borderRadius: {
        xs: `${tokens.global.radii.xs.value}px`,
        sm: `${tokens.global.radii.sm.value}px`,
        md: `${tokens.global.radii.md.value}px`,
        lg: `${tokens.global.radii.lg.value}px`,
        xl: `${tokens.global.radii.xl.value}px`,
        full: '9999px',
      },
      // extend other scales…
    },
  },
};
````

Define colour names that reflect their **role** (e.g., `primary`, `on-primary`, `surface`, `outline`) rather than raw hues.
This semantic mapping ensures tokens remain meaningful when the palette changes.

---

## CSS Variables

For global styles or integration with libraries like **shadcn/ui**, you can output tokens as **CSS variables**.
Use a tool like **Style Dictionary** or a custom script to generate a `:root` selector with variables:

```css
:root {
  --color-primary: #ff5722;
  --color-on-primary: #ffffff;
  --spacing-1: 4px;
  --spacing-2: 8px;
  /* etc. */
}
```

Then reference these variables in Tailwind via a custom plugin or define classes in your component library.

---

## Updating Tokens

When updating tokens:

1. Update the `design_tokens.json` file with new or modified tokens.
   Ensure each token has `$value`, `$type`, and `$description`.

2. If adding new roles (e.g., warning, info), update both **light** and **dark** themes accordingly.

3. Regenerate the Tailwind config using your script.
   Run `pnpm tokens:build` or a similar command to update CSS variables and theme.

4. Test components in both **light** and **dark** modes to verify colours and spacing render correctly.

5. Update **class-variance-authority variants** if new token roles require new component variants.

---

## Adding New Tokens

Follow the **DTCG format** and group tokens by category (`color`, `spacing`, `radius`, `typography`, etc.).

Example — adding a new breakpoint and a new state colour:

```json
{
  "global": {
    "breakpoints": {
      "2xl": { "$type": "dimension", "$value": "1536" }
    },
    "states": {
      "visited": { "$type": "opacity", "$value": 0.7, "$description": "Opacity for visited links" }
    }
  }
}
```

When mapping to Tailwind:

* Define responsive utilities (e.g., `@media (min-width: 1536px)`)
* Create classes for visited state (e.g., `visited:text-primary`)

---

## Using Tokens in Components

Refer to `COMPONENTS_GUIDE.md` for patterns on integrating tokens into your component classes.
Always **reference tokens** rather than hard-coding values.

When customizing a component library like **shadcn/ui**, provide a theme object mapping tokens to component parts.

---

## Summary

Design tokens unify the **design language** across web and mobile platforms.
Mapping tokens to **Tailwind** and **CSS variables** ensures style consistency and makes it easy to switch themes or update branding.

Follow the guidelines above when adding or updating tokens to keep the **design system robust and maintainable**.

---

