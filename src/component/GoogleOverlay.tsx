import { onCleanup, onMount } from 'solid-js';

interface GoogleOverlayProps {
  map: google.maps.Map;
  position: google.maps.LatLngLiteral;
  content: string;
}

const GoogleOverlay = (props: GoogleOverlayProps) => {
  let overlayDiv: HTMLDivElement | undefined;

  class Overlay extends google.maps.OverlayView {
    onAdd() {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.innerHTML = props.content;
      overlayDiv = div;
      const panes = this.getPanes();
      panes?.overlayLayer.appendChild(div);
    }

    draw() {
      const overlayProjection = this.getProjection();
      const position = overlayProjection.fromLatLngToDivPixel(new google.maps.LatLng(props.position));
      if (overlayDiv) {
        overlayDiv.style.left = position?.x + 'px';
        overlayDiv.style.top = position?.y + 'px';
      }
    }

    onRemove() {
      if (overlayDiv) {
        overlayDiv.parentNode?.removeChild(overlayDiv);
        overlayDiv = undefined;
      }
    }
  }

  onMount(() => {
    const overlay = new Overlay();
    overlay.setMap(props.map);

    onCleanup(() => {
      overlay.setMap(null);
    });
  });

  return null;
};

export default GoogleOverlay;
