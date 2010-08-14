/**/

function CanvasPieChart( containerElemId, data, options )
{
    var t = this;

    t.data = data || [];
    t.doc = options.doc || document;
    t.canvasWrapper = t.doc.getElementById( containerElemId );
    t.canvas = null;
    t.width = options.width || 400;
    t.height = options.height || 400;
    t.strokeLineWidth = options.strokeLineWidth || 2;

    
    function getTotal()
    {
        var total = 0, i;

        for ( i = 0; i < t.data.length; i++ )
        {
            total += (typeof t.data[i].value == 'number') ? t.data[i].value : 0;
        }

        return total;
    }
    

    function createCanvas()
    {
        var canvas = t.doc.createElement('canvas');

        canvas.id = containerElemId + '-canvas';
        canvas.width = t.width;
        canvas.height = t.height;

        t.canvasWrapper.appendChild(canvas);
        t.canvas = canvas;

        var shim = t.doc.createElement('img');
        shim.src = './images/pix.png';
        shim.border = 0;
        shim.width = t.canvas.width;
        shim.height = t.canvas.height;
        shim.style.position = 'absolute';
        shim.style.left = 0;
        shim.style.top = 0;
        shim.useMap = '#' + containerElemId + '-image-map';

        t.canvasWrapper.style.position = 'relative';

        t.canvasWrapper.appendChild(shim);
    }


    function createPieChart() {
        var ctx,
                arcStartAngle,
                arcEndAngle,
                total,
                width,
                height,
                centerX,
                centerY,
                label,
                value,
                color,
                radius,
                i,
                index,
                val;

        ctx = t.canvas.getContext("2d");
        width = t.canvas.width;
        height = t.canvas.height;
        centerX = width / 2;
        centerY = height / 2;
        radius = width / 2;
        total = getTotal();
        index = 0;

        ctx.clearRect( 0, 0, width, height );

        for ( i = 0; i < t.data.length; i++ )
        {
            
            label = t.data[i].label;
            value = t.data[i].value;
            color = t.data[i].color;
            val = value / total;

            arcStartAngle = Math.PI * ( - 0.5 + 2 * index ); // -0.5 sets set the start to be top
            arcEndAngle = Math.PI * ( - 0.5 + 2 * ( index + val ) );
            
            ctx.lineWidth = t.strokeLineWidth;
            ctx.strokeStyle = "#FFFFFF";
            ctx.fillStyle = color;

            ctx.beginPath();
            ctx.moveTo( centerX, centerY );
            ctx.arc( centerX, centerY, radius, arcStartAngle, arcEndAngle, false );
            ctx.lineTo( centerX, centerY );
            ctx.fill();
            ctx.stroke();
            
            index += val; // increment progress tracker
        }
    }

    function createImageMap()
    {
       var ctx,
                arcStartAngle,
                arcEndAngle,
                total = getTotal(),
                label,
                value,
                radius,
                i,
                index,
                val,
                pieVertices,
                arcIncrementMultiplier,
                imageMap,
                area,
                j;

        radius = t.canvas.width / 2;
        pieVertices = 12; // Does not include the center vertex
        arcIncrementMultiplier = 1 / pieVertices;
        index = 0;
        
        imageMap = t.doc.createElement('map');
        imageMap.name = containerElemId + '-image-map';

        t.canvasWrapper.appendChild(imageMap);

        for ( i = 0; i < t.data.length; i++ )
        {
            label = t.data[i].label;
            value = t.data[i].value;

            val = value / total;

            arcStartAngle = Math.PI * (- 0.5 + 2 * index); // -0.5 sets set the start to be top
            arcEndAngle = Math.PI * (- 0.5 + 2 * (index + val));

            var arcIncrement = (arcEndAngle - arcStartAngle) * arcIncrementMultiplier;

			var xx = radius + Math.round(Math.cos(arcStartAngle) * radius);
			var yy = radius + Math.round(Math.sin(arcStartAngle) * radius);

			var coord = [];
			var coordIndex = 1;

			for ( j = 0; j < ((pieVertices * 2) - 2); j = j+2 ) {
				var arcAngle = arcStartAngle + arcIncrement * coordIndex;
				coord[j] = radius + Math.round( Math.cos( arcAngle ) * radius );
				coord[j+1] = radius + Math.round( Math.sin( arcAngle ) * radius );
				coordIndex++;
			}

			var xxEnd = radius + Math.round( Math.cos(arcEndAngle ) * radius );
			var yyEnd = radius + Math.round( Math.sin(arcEndAngle ) * radius );

            area = t.doc.createElement( 'area' );
            area.shape = 'poly';
            area.coords = radius + ',' + radius + ','  + xx + ',' + yy + ',' + coord.join( ',' ) +  ',' + xxEnd + ',' + yyEnd;

            area.title = label;

            imageMap.appendChild( area );

            index += val; // increment progress tracker
        }
    }
    
    createCanvas();
    createPieChart();
    createImageMap();
}