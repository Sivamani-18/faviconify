import React, { useEffect, useRef, useCallback } from 'react';

interface ParticleGroundProps {
  minSpeedX?: number;
  maxSpeedX?: number;
  minSpeedY?: number;
  maxSpeedY?: number;
  directionX?: 'center' | 'left' | 'right';
  directionY?: 'center' | 'up' | 'down';
  density?: number;
  dotColor?: string;
  lineColor?: string;
  particleRadius?: number;
  lineWidth?: number;
  curvedLines?: boolean;
  proximity?: number;
  parallax?: boolean;
  parallaxMultiplier?: number;
  onInit?: () => void;
  onDestroy?: () => void;
}

const defaultProps: Required<ParticleGroundProps> = {
  minSpeedX: 0.1,
  maxSpeedX: 0.7,
  minSpeedY: 0.1,
  maxSpeedY: 0.7,
  directionX: 'center',
  directionY: 'center',
  density: 10000,
  dotColor: '#666666',
  lineColor: '#666666',
  particleRadius: 7,
  lineWidth: 1,
  curvedLines: false,
  proximity: 100,
  parallax: true,
  parallaxMultiplier: 5,
  onInit: () => {},
  onDestroy: () => {},
};

const ParticleGround: React.FC<ParticleGroundProps> = (props) => {
  const {
    minSpeedX,
    maxSpeedX,
    minSpeedY,
    maxSpeedY,
    directionX,
    directionY,
    density,
    dotColor,
    lineColor,
    particleRadius,
    lineWidth,
    curvedLines,
    proximity,
    parallax,
    parallaxMultiplier,
    onInit,
    onDestroy,
  } = { ...defaultProps, ...props };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const tiltX = useRef(0);
  const tiltY = useRef(0);
  const paused = useRef(false);
  const isDesktop = useRef(
    !navigator.userAgent.match(
      /(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i
    )
  );
  const hasOrientationSupport = useRef(!!window.DeviceOrientationEvent);

  class Particle {
    position: { x: number; y: number };
    speed: { x: number; y: number };
    layer: number;
    parallaxOffsetX: number = 0;
    parallaxOffsetY: number = 0;
    parallaxTargX: number = 0;
    parallaxTargY: number = 0;
    stackPos: number = 0;
    active: boolean = true;

    constructor() {
      const canvasWidth = canvasRef.current?.width || 0;
      const canvasHeight = canvasRef.current?.height || 0;

      this.position = {
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
      };

      this.speed = {
        x: calculateSpeedX(),
        y: calculateSpeedY(),
      };

      this.layer = Math.ceil(Math.random() * 3);
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.beginPath();
      ctx.arc(
        this.position.x + this.parallaxOffsetX,
        this.position.y + this.parallaxOffsetY,
        particleRadius / 2,
        0,
        Math.PI * 2,
        true
      );
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      for (let i = particles.current.length - 1; i > this.stackPos; i--) {
        const p2 = particles.current[i];
        const dist = calculateDistance(this.position, p2.position);
        if (dist < proximity) {
          ctx.moveTo(
            this.position.x + this.parallaxOffsetX,
            this.position.y + this.parallaxOffsetY
          );
          if (curvedLines) {
            ctx.quadraticCurveTo(
              p2.position.x,
              p2.position.y,
              p2.position.x + p2.parallaxOffsetX,
              p2.position.y + p2.parallaxOffsetY
            );
          } else {
            ctx.lineTo(
              p2.position.x + p2.parallaxOffsetX,
              p2.position.y + p2.parallaxOffsetY
            );
          }
        }
      }
      ctx.stroke();
      ctx.closePath();
    }

    updatePosition() {
      if (parallax) {
        const { winW, winH } = getWindowDimensions();
        const pointerX =
          hasOrientationSupport.current && !isDesktop.current
            ? mapTilt(tiltX.current, winW)
            : mouseX.current;
        const pointerY =
          hasOrientationSupport.current && !isDesktop.current
            ? mapTilt(tiltY.current, winH)
            : mouseY.current;

        this.parallaxTargX =
          (pointerX - winW / 2) / (parallaxMultiplier * this.layer);
        this.parallaxOffsetX +=
          (this.parallaxTargX - this.parallaxOffsetX) / 10;
        this.parallaxTargY =
          (pointerY - winH / 2) / (parallaxMultiplier * this.layer);
        this.parallaxOffsetY +=
          (this.parallaxTargY - this.parallaxOffsetY) / 10;
      }

      const canvasWidth = canvasRef.current?.width || 0;
      const canvasHeight = canvasRef.current?.height || 0;

      this.position.x = updatePositionForAxis(
        this.position.x,
        this.speed.x,
        this.parallaxOffsetX,
        canvasWidth
      );
      this.position.y = updatePositionForAxis(
        this.position.y,
        this.speed.y,
        this.parallaxOffsetY,
        canvasHeight
      );
    }
  }

  const calculateSpeedX = () =>
    calculateSpeed(directionX, minSpeedX, maxSpeedX);
  const calculateSpeedY = () =>
    calculateSpeed(directionY, minSpeedY, maxSpeedY);

  const calculateSpeed = (
    direction: 'center' | 'left' | 'right' | 'up' | 'down',
    minSpeed: number,
    maxSpeed: number
  ): number => {
    let speed =
      direction === 'left' || direction === 'up'
        ? -maxSpeed + Math.random() * (maxSpeed - minSpeed)
        : Math.random() * (maxSpeed - minSpeed) + minSpeed;

    if (direction === 'center') {
      speed = -maxSpeed / 2 + Math.random() * maxSpeed;
      speed += speed > 0 ? minSpeed : -minSpeed;
    }
    return speed;
  };

  const calculateDistance = (
    pos1: { x: number; y: number },
    pos2: { x: number; y: number }
  ): number => {
    const a = pos1.x - pos2.x;
    const b = pos1.y - pos2.y;
    return Math.sqrt(a * a + b * b);
  };

  const getWindowDimensions = () => {
    return { winW: window.innerWidth, winH: window.innerHeight };
  };

  const mapTilt = (tilt: number, dimension: number) => {
    return (dimension / 60) * (tilt + 30);
  };

  const updatePositionForAxis = (
    position: number,
    speed: number,
    parallaxOffset: number,
    canvasSize: number
  ): number => {
    if (position + speed + parallaxOffset > canvasSize) {
      return 0 - parallaxOffset;
    } else if (position + speed + parallaxOffset < 0) {
      return canvasSize - parallaxOffset;
    }
    return position + speed;
  };

  const initParticles = useCallback(() => {
    const canvasWidth = canvasRef.current?.width || 0;
    const canvasHeight = canvasRef.current?.height || 0;
    const numParticles = Math.round((canvasWidth * canvasHeight) / density);

    particles.current = [];
    for (let i = 0; i < numParticles; i++) {
      const particle = new Particle();
      particle.stackPos = i;
      particles.current.push(particle);
    }
  }, [density]);

  const drawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    particles.current.forEach((particle) => particle.updatePosition());
    particles.current.forEach((particle) => particle.draw(ctx));
  }, []);

  const handleResize = useCallback(() => {
    if (!canvasRef.current) return;
    const canvasWidth = canvasRef.current.offsetWidth || 0;
    const canvasHeight = canvasRef.current.offsetHeight || 0;
    initParticles();

    particles.current = particles.current.filter(
      (p) => p.position.x <= canvasWidth && p.position.y <= canvasHeight
    );
  }, [initParticles]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseX.current = e.pageX;
    mouseY.current = e.pageY;
  }, []);

  const handleDeviceOrientation = useCallback((e: DeviceOrientationEvent) => {
    tiltY.current = Math.min(Math.max(-e.beta!, -30), 30);
    tiltX.current = Math.min(Math.max(-e.gamma!, -30), 30);
  }, []);

  const startAnimation = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const draw = () => {
        drawParticles(ctx);
        if (!paused.current) {
          animationFrameId.current = requestAnimationFrame(draw);
        }
      };
      draw();
    },
    [drawParticles]
  );

  const destroyParticles = useCallback(() => {
    onDestroy?.();
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  }, [onDestroy]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = canvas.parentElement?.offsetWidth || 0;
        canvas.height = canvas.parentElement?.offsetHeight || 0;
        ctx.fillStyle = dotColor;
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        initParticles();
        startAnimation(ctx);
        onInit?.();
      }

      const resizeHandler = handleResize;
      const moveHandler = handleMouseMove;
      const orientationHandler = handleDeviceOrientation;

      window.addEventListener('resize', resizeHandler);
      document.addEventListener('mousemove', moveHandler);
      if (hasOrientationSupport.current && !isDesktop.current) {
        window.addEventListener('deviceorientation', orientationHandler);
      }

      return () => {
        destroyParticles();
        window.removeEventListener('resize', resizeHandler);
        document.removeEventListener('mousemove', moveHandler);
        window.removeEventListener('deviceorientation', orientationHandler);
      };
    }
  }, [
    dotColor,
    lineColor,
    lineWidth,
    initParticles,
    startAnimation,
    onInit,
    handleResize,
    handleMouseMove,
    handleDeviceOrientation,
    destroyParticles,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className='pg-canvas'
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }}
    />
  );
};

export default ParticleGround;
