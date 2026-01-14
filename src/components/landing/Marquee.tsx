import React from 'react';
import styled, { keyframes } from 'styled-components';

const marqueeAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

const MarqueeWrapper = styled.div`
  overflow: hidden;
  width: 100%;
`;

const MarqueeContent = styled.div`
  display: flex;
  animation: ${marqueeAnimation} 20s linear infinite;

  &:hover {
    animation-play-state: paused;
  }
`;

const MarqueeItem = styled.h6`
  white-space: nowrap;
  padding: 0 35px;
  margin: 0;
`;

const Marquee: React.FC = () => {
  return (
    <section className="marquee__area section-pt-120">
      <MarqueeWrapper className="slider__marquee clearfix marquee-wrap">
        <MarqueeContent className="marquee_mode marquee__group">
          <MarqueeItem className="marquee__item">You will hold the way you love Webzo</MarqueeItem>
          <MarqueeItem className="marquee__item">You will hold the way you love Webzo</MarqueeItem>
        </MarqueeContent>
      </MarqueeWrapper>
    </section>
  );
};

export default Marquee;
