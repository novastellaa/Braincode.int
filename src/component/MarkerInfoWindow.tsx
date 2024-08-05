import { createEffect, createSignal } from 'solid-js';
import { titleState } from '../store/store';

interface MarkerInfoWindowProps {
  marker: google.maps.Marker;
  content: string;
}

const MarkerInfoWindow = (props: MarkerInfoWindowProps) => {
  const [isOpen, setIsOpen] = createSignal(false);

  const toggleInfoWindow = () => {
    setIsOpen(!isOpen());
  };

  createEffect(() => {
    console.log("titleState Marker -> ", titleState())
  })

  return (
    <>
      <div style={{ display: 'none' }}>{props.content}</div>
      <div>
        <button onClick={toggleInfoWindow}>Toggle Info Window</button>
      </div>
      {isOpen() && (
        <div >
            {titleState()} 
          <div>{props.content}</div>
        </div>
      )}
    </>
  );
};

export default MarkerInfoWindow;
