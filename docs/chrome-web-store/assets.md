# Store asset workflow

The Store screenshots are generated from the real production extension UI with deterministic sample calculations. The promotional tiles use the same visual system and example values.

## Regenerate screenshots

Build the extension and start a local production preview on port `4173`:

```powershell
npm run build
npm exec vite -- preview --host 127.0.0.1 --port 4173
```

In a second terminal, capture all five screenshots:

```powershell
npm run store:screenshots
```

## Regenerate promotional tiles

```powershell
npm run store:promo
```

## Validate every asset

```powershell
npm run store:validate
```

Validation checks that screenshots are 1280 × 800, promotional tiles use their required dimensions, every file is PNG, and no image has an alpha channel.
