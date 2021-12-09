import { useCallback } from 'react';
import { Graphics, Container } from '@inlet/react-pixi';
import { yellow, blue, white, darkGray } from '../utils/colors'

const Face = (props) => {
  const draw = useCallback((g) => {
    g.clear();
    g.beginFill(props.faceColor);
    // outline the face according to props.parentShape and fill with face color
    // the above should be implemented in higher-up components
    
    g.drawCircle(0, 0, 85); 


        // canvas top left(0,0)
        // minimum size
        // position, scale of container 
    g.endFill();

    // draw 2 eyes given props.eyeSpacing, .eyePosition
    g.beginFill();
    g.drawEllipse(props.eyePosition[0], props.eyePosition[1], props.eyeWidth, props.eyeHeight);
    g.drawEllipse(props.eyePosition[0]+props.eyeSpacing, props.eyePosition[1], props.eyeWidth, props.eyeHeight);
    g.endFill();

    g.beginFill(white);
    g.drawCircle(props.eyePosition[0]-3, props.eyePosition[1]-8, 4);
    g.drawCircle(props.eyePosition[0]-3+props.eyeSpacing, props.eyePosition[1]-8, 4);
    g.endFill();

    // draw 2 eyeBrows given props.browType, .browPosition, .browAngle(in radians), .browLength
    g.beginFill();
    g.lineStyle(width=4);
    // NOTE: FOR NOW ONLY SAD BROWS PART IS WORKING
    // calculate and line to the end point of the left brow with the given browAngle
    g.moveTo(props.browPosition[0], props.browPosition[1]); // starting point is the right high end of the left sad brow
    const sadbrow_left = [props.browPosition[0]-(Math.cos(props.browAngle)*props.browLength), props.browPosition[1]+(Math.sin(props.browAngle)*props.browLength)];
    angrybrow_left;
    // angry brows
    if (props.browAngle < 0) { 
      g.lineTo(props.browPosition[0]+(Math.cos(-props.browAngle)*props.browLength), props.browPosition[1]+(Math.sin(-props.browAngle)*props.browLength));
    }
    // sad brows
    else if (props.browAngle > 0) {
      g.lineTo(sadbrow_left[0],sadbrow_left[1]);
    }
    // neutral brows
    else {
      g.lineTo(props.browPosition[0]+props.browLength, props.browPosition[1]);
    }

    // symmetrically draw the right brow 
    g.moveTo(-props.browPosition[0], props.browPosition[1]);
    // angry brows
    if (props.browAngle < 0) { 
      g.lineTo(props.browPosition[0]+(Math.cos(-props.browAngle)*props.browLength), props.browPosition[1]+(Math.sin(-props.browAngle)*props.browLength));
    }
    // sad brows
    else if (props.browAngle > 0) {
      g.lineTo(-sadbrow_left[0], sadbrow_left[1]);
    }
    // neutral brows
    else {
      g.lineTo(props.browPosition[0]+props.browLength, props.browPosition[1]);
    }

    //g.drawRect(props.eyebrowPosition[0], props.eyebrowPosition[1], props.eyebrowWidth, props.eyebrowHeight);
    g.endFill();

    // draw mouth given props.mouthType, .mouthPosition
    g.beginFill();
    g.drawRect(props.mouthPosition[0], props.mouthPosition[1], props.mouthWidth, props.mouthHeight);
    g.endFill();

  }, [props]);

  //return <Graphics draw={draw} />;
  return (
    <Container position={[200, 200]} scale={1}>
      <Graphics draw={draw} />
    </Container>
  );

}
// import { Face } from './file_name.js';
// export { Face };

// import Face from './file_name.js';
export default Face;