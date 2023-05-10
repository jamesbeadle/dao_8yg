import React, { useState, useEffect, useRef } from 'react';

const CustomSVG = ({ canisterId, tokenId, className, style }) => {
  const [svgContent, setSvgContent] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchSVG = async () => {
      const response = await fetch(`https://${canisterId}.raw.ic0.app/?tokenid=${tokenId}`);
      const svgText = await response.text();
      
      // Parse SVG content into a Document object
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

       // Find and remove width and height attributes from image and svg elements
       const imageElement = svgDoc.querySelector("image");
       
       imageElement.removeAttribute("width");
       imageElement.removeAttribute("height");
       imageElement.setAttribute("style", "width: 100%; height: auto;");
 
       

       const imageUrl = imageElement.getAttribute("href");

       // Fetch the image URL and get its dimensions
       const imgResponse = await fetch(imageUrl);
       const imgBlob = await imgResponse.blob();
       const img = new Image();
       img.src = URL.createObjectURL(imgBlob);
 
       img.onload = () => {
        const width = img.width;
        const height = img.height;
      
        const aspectRatio = height / width;
        const containerWidth = containerRef.current.offsetWidth;
        const calculatedHeight = containerWidth * aspectRatio;
      
        const svgElement = svgDoc.querySelector("svg");
        svgElement.removeAttribute("width");
        svgElement.removeAttribute("height");
        svgElement.setAttribute("style", `width: 100%; height: ${calculatedHeight}px;`);
      
        setSvgContent(svgDoc.documentElement.outerHTML);
 
       };

       //svgElement.setAttribute("style", "width: 100%; height: 500px;");

      // Set modified SVG content as state
      //setSvgContent(svgDoc.documentElement.outerHTML);
      
    };

    fetchSVG();
  }, [canisterId, tokenId]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default CustomSVG;
