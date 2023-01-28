# rbgen

This Javascript plugin randomly generates/applies an SVG background image to an HTML element. To see it in action, please visit https://trigvi.github.io/rbgen/

The generated image is made of a colored background plus several shapes with random opacity, position, size.

## How to use it in your HTML page

There are two steps:

- Add `data-rbgen-` attributes to your desidered HTML element(s). For example:
    ```
    <div
        data-rbgen-width="3840"
        data-rbgen-height="2160"
        data-rbgen-tone="pastel"
        data-rbgen-shapes="circles"
        data-rbgen-shapes-count="10"
        data-rbgen-shapes-color-hex="#000000"
        data-rbgen-shapes-max-opacity="0.05"
    >
        Some text
    </div>
    ```

- Add the following code to the bottom of your HTML page, just before `</body>`:
    ```
    <script src="https://cdn.jsdelivr.net/gh/trigvi/rbgen/rbgen-minified.js"></script>
    <script>
        let rbgen = new Rbgen();
        rbgen.apply();
    </script>
    ```

## Available attributes

- **data-rbgen-width** / **data-rbgen-height** -- These are optional. In any case, the image background gets applied with CSS directives that make it cover the entire width/height of the HTML element.

- **data-rbgen-tone** -- Either `pastel`, `medium`, `dark`. This tells the generator to use a random background color for the image but gets ignored if **data-rbgen-bgcolor-hex** is used.

- **data-rbgen-bgcolor-hex** -- Value should look like `#ffff00`. This specifies a fixed background color for the image.

- **data-rbgen-shapes** -- Either `circles` or `rectangles`. This determines the kind of random shapes that get created inside the image.

- **data-rbgen-shapes-count** -- Value should look like `10`. Numeric value that determines how many random shapes get created inside the image.

- **data-rbgen-shapes-color-hex** -- Value should look like `#ffff00`. This is the color of the random shapes that get created inside the image.

- **data-rbgen-shapes-max-opacity** -- Value should look like `0.05` (minimum `0`, maximum `1`). This is the maximum random opacity of the random shapes that get created inside the image,
