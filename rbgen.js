function Rbgen() {

    this.apply = function(applyCallback) {

        for (let htmlElement of document.querySelectorAll('.rbgen')) {
            const settings = {
                width: htmlElement.getAttribute('data-rbgen-width'),
                height: htmlElement.getAttribute('data-rbgen-height'),
                backgroundColorHex: htmlElement.getAttribute('data-rbgen-bgcolor-hex'),
                tone: htmlElement.getAttribute('data-rbgen-tone'), // if 'backgroundColorHex' is passed then 'tone gets ignored'
                shapes: htmlElement.getAttribute('data-rbgen-shapes'),
                shapesCount: htmlElement.getAttribute('data-rbgen-shapes-count'),
                shapesColorHex: htmlElement.getAttribute('data-rbgen-shapes-color-hex'),
                shapesMaximumOpacity: htmlElement.getAttribute('data-rbgen-shapes-max-opacity')
            };
            const {backgroundColorHex, svgHtml} = this.generateSvgImageAsHtml(settings);
            const svgAsUrl = this.convertSvgHtmlImageToBackgroundUrl(svgHtml);
            htmlElement.setAttribute('data-rbgen-current-bgcolor-hex', backgroundColorHex);
            htmlElement.setAttribute('data-rbgen-current-raw', btoa(svgHtml));
            htmlElement.style.background = "no-repeat black " + svgAsUrl;
            htmlElement.style.backgroundSize = "cover";
        }

        if (typeof applyCallback === 'function') {
            applyCallback();
        }
    };

    this.downloadImage = function(elementIdOrClass) {

        let element;

        const elementById = document.getElementById(elementIdOrClass);
        const elementByClass = document.querySelector(elementIdOrClass);
        if (elementById) {
            element = elementById;
        } else if (elementByClass) {
            element = elementByClass;
        } else {
            return;
        }

        const svgHtmlBase64 = element.getAttribute('data-rbgen-current-raw');
        if (!svgHtmlBase64) {
            return;
        }

        const svgHtml = atob(svgHtmlBase64);
        const filename = this.generateRandomString(10) + '.svg';
        const temporaryElement = document.createElement('a');
        temporaryElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(svgHtml));
        temporaryElement.setAttribute('download', filename);
        temporaryElement.style.display = 'none';
        document.body.appendChild(temporaryElement);
        temporaryElement.click();
        temporaryElement.remove();
    };

    this.generateSvgImageAsHtml = function(settings) {

        // settings example
        // {
        //     width: 7680,
        //     height: 4320,
        //     backgroundColorHex: '#ffffff',
        //     tone: null, // 'pastel', 'medium', 'dark' (please note that 'tone' gets ignored if 'backgroundColorHex' is passed)
        //     shapes: 'circles', // rectangles, circles
        //     shapesCount: 20,
        //     shapesColorHex: '#000000',
        //     shapesMaximumOpacity: 0.05, // any value between 0.01 and 1
        // }

        settings = settings || {};
        if (!settings.width || !settings.height) {
            settings.width = 7680;
            settings.height = 4320;
        }
        if (!settings.shapes) {
            settings.shapes = 'circles';
        }
        if (!settings.shapesCount) {
            settings.shapesCount = 20;
        }
        if (!settings.shapesColorHex) {
            settings.shapesColorHex = '#000000';
        }
        if (!settings.shapesMaximumOpacity) {
            settings.shapesMaximumOpacity = 0.05;
        }
        if (!settings.backgroundColorHex) {
            if (!settings.tone) {
                settings.tone = 'pastel';
            }
            settings.backgroundColorHex = this.generateRandomHexColorString(settings.tone);
        }

        // Generate new image as HTML element in memory
        let svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('viewBox', '0 0 ' + settings.width.toString() + ' ' + settings.height.toString());
        svg.setAttribute('width', settings.width);
        svg.setAttribute('height', settings.height);
        let singleShapeMaxDimension = settings.height;
        if (settings.height > settings.width) {
            singleShapeMaxDimension = settings.width;
        }

        // Add background rectangle element to image
        let backgroundRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        backgroundRect.setAttribute('width', settings.width);
        backgroundRect.setAttribute('height', settings.height);
        backgroundRect.setAttribute('style', 'fill: ' + settings.backgroundColorHex);
        svg.appendChild(backgroundRect);

        for (let idx=1; idx<=settings.shapesCount; idx++) {
            const shapeOpacity = parseFloat(settings.shapesMaximumOpacity) * Math.random();
            if (settings.shapes === 'rectangles') {
                const rectWidth = Math.random() * (singleShapeMaxDimension/1.5);
                const rectHeight = Math.random()* rectWidth;
                let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('width', parseInt(rectWidth));
                rect.setAttribute('height', parseInt(rectHeight));
                rect.setAttribute('x', parseInt(settings.width * Math.random()));
                rect.setAttribute('y', parseInt(settings.height * Math.random()));
                rect.setAttribute('style', 'fill: ' + settings.shapesColorHex + '; opacity: ' + shapeOpacity);
                svg.appendChild(rect);
            } else if (settings.shapes === 'circles') {
                const circleWidth = Math.random() * (singleShapeMaxDimension/1.5);
                const circleRadius = circleWidth / 2;
                let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('r', parseInt(circleRadius));
                circle.setAttribute('cx', parseInt(settings.width * Math.random()));
                circle.setAttribute('cy', parseInt(settings.height * Math.random()));
                circle.setAttribute('style', 'fill: ' + settings.shapesColorHex + '; opacity: ' + shapeOpacity);
                svg.appendChild(circle);
            }
        }

        return {
            backgroundColorHex: settings.backgroundColorHex,
            svgHtml: svg.outerHTML
        };
    };

    this.convertSvgHtmlImageToBackgroundUrl = function(svgHtml) {
        return "url('data:image/svg+xml;utf8," + encodeURIComponent(svgHtml) + "')";
    };

    this.generateRandomHexColorString = function(tone) {

        // Generate random HSL color
        let h, s, l;
        if (tone === 'pastel') {
            h = 360 * Math.random();
            s = 80;
            l = 90;
        } else if (tone === 'medium') {
            h = 360 * Math.random();
            s = 30;
            l = 50;
        } else if (tone === 'dark') {
            h = 360 * Math.random();
            s = 30;
            l = 20;
        }

        // Convert to RGB then to HEX then stringify for CSS
        const rgb = this.HSLToRGB(h, s, l);
        const hex = this.RGBToHex(rgb[0], rgb[1], rgb[2]);
        return hex;
    };

    this.HSLToRGB = function(h, s, l) {

        s /= 100;
        l /= 100;

        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c/2;
        let r = 0;
        let g = 0;
        let b = 0;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return [r, g, b];
    };

    this.RGBToHex = function(r, g, b) {

        r = r.toString(16);
        g = g.toString(16);
        b = b.toString(16);

        if (r.length == 1) {
            r = '0' + r;
        }
        if (g.length == 1) {
            g = '0' + g;
        }
        if (b.length == 1) {
            b = '0' + b;
        }

        return '#' + r + g + b;
    };

    this.generateRandomString = function(length) {

        let result = '';
        const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;
        for (let idx=0; idx<length; idx++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}

