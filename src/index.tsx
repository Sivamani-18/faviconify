import React, { useEffect, useRef } from 'react';

interface FaviconifyProps {
  fontFamily?: string;
  textColor?: string;
  bgColor?: string;
  iconShape?: 'circle' | 'square' | 'rounded';
  fontWeight?: string;
  textSize?: number;
  textContent?: string;
  imageUrl?: string;
}

const Faviconify: React.FC<FaviconifyProps> = ({
  fontFamily = 'Arial',
  textColor = '#FFF',
  bgColor = '#000',
  iconShape = 'circle',
  fontWeight = '400',
  textSize = 200,
  textContent = 'S',
  imageUrl,
}) => {
  const faviconLinkRef = useRef<HTMLLinkElement | null>(null);

  useEffect(() => {
    let base64Favicon: string;

    if (imageUrl) {
      // Use provided image URL as favicon
      base64Favicon = imageUrl;
    } else {
      // Generate the favicon
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the background based on the shape
        if (iconShape === 'circle') {
          ctx.beginPath();
          ctx.arc(
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 2,
            0,
            2 * Math.PI
          );
          ctx.fillStyle = bgColor;
          ctx.fill();
        } else if (iconShape === 'rounded') {
          const radius = 50;
          ctx.beginPath();
          ctx.moveTo(radius, 0);
          ctx.lineTo(canvas.width - radius, 0);
          ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
          ctx.lineTo(canvas.width, canvas.height - radius);
          ctx.quadraticCurveTo(
            canvas.width,
            canvas.height,
            canvas.width - radius,
            canvas.height
          );
          ctx.lineTo(radius, canvas.height);
          ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
          ctx.lineTo(0, radius);
          ctx.quadraticCurveTo(0, 0, radius, 0);
          ctx.closePath();
          ctx.fillStyle = bgColor;
          ctx.fill();
        } else {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Draw the text
        ctx.font = `${fontWeight} ${textSize}px ${fontFamily}`;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(textContent, canvas.width / 2, canvas.height / 2);

        base64Favicon = canvas.toDataURL('image/png');
      } else {
        return;
      }
    }

    // Remove existing favicon link if it exists
    if (faviconLinkRef.current) {
      faviconLinkRef.current.remove();
    }

    // Add the new favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = imageUrl?.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
    link.href = base64Favicon;
    document.head.appendChild(link);

    // Store the created link element in the ref
    faviconLinkRef.current = link;

    // Cleanup function to remove the favicon when the component unmounts or updates
    return () => {
      if (faviconLinkRef.current) {
        faviconLinkRef.current.remove();
        faviconLinkRef.current = null;
      }
    };
  }, [
    fontFamily,
    textColor,
    bgColor,
    iconShape,
    fontWeight,
    textSize,
    textContent,
    imageUrl,
  ]);

  return null;
};

export default Faviconify;
