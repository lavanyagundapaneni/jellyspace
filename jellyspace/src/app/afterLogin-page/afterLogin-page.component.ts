import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-afterLogin-page',
  templateUrl: './afterLogin-page.component.html'
})
export class AfterLoginPageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.initCanvas();
  }

  initCanvas(): void {
    const canvas = document.getElementById('visoCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 200;
    const innerRadius = 100;
    const sections: { label: string, icon: string, angle: number, link: string, clickableArea?: { x: number, y: number, width: number, height: number } }[] = [
      {
        label: 'Digital Acquisitions',
        icon: '🔗',
        angle: -Math.PI / 2,
        link: 'dashboard' // This should match the route path in app-routing.module.ts
      },
      {
        label: 'IoT/Satellites',
        icon: '📡',
        angle: -Math.PI / 5,
        link: ''
      },
      {
        label: 'Product Life Cycle Management',
        icon: '🔄',
        angle: 0,
        link: ''
      },
      {
        label: 'Logistics',
        icon: '📦',
        angle: Math.PI / 3,
        link: ''
      },
      {
        label: 'Maintenance',
        icon: '⚙️',
        angle: 2 * Math.PI / 3,
        link: ''
      },
      {
        label: 'Manufacturing & Robotics',
        icon: '🤖',
        angle: 3 * Math.PI / 3,
        link: ''
      },
      {
        label: 'SCM-AI',
        icon: '📈',
        angle: -4 * Math.PI / 5,
        link: 'home'
      }
    ];

    let angle = 1;
    const speed = 0.01; // Adjust the speed of the rocket
    let trail: { x: number, y: number }[] = [];
    let index = 0;

    const logoImg = new Image();
    logoImg.src = '../../assets/img/jelly.png';
    logoImg.width = 100;
    logoImg.height = 100;

    function drawCircle() {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#808080'; // Changed to grey
      ctx.stroke();
    }

    function drawInnerCircle() {
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI, false);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 0.5; // Reduced width of the inner circle
      ctx.strokeStyle = '#BFBFBF';
      ctx.stroke();

      // Draw the image in the inner circle
      const imgX = centerX - logoImg.width / 1.27;
      const imgY = centerY - logoImg.height / 1.4;
      ctx.drawImage(logoImg, imgX, imgY);
    }

    function drawText() {
      ctx.fillStyle = '#fff';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
    }

    function drawSection(section: { label: string, icon: string, angle: number, link: string, clickableArea?: { x: number, y: number, width: number, height: number } }) {
      const labelX = centerX + (innerRadius + 40) * Math.cos(section.angle);
      const labelY = centerY + (innerRadius + 40) * Math.sin(section.angle);

      ctx.save();
      ctx.translate(labelX, labelY);
      ctx.rotate(0); // Keep text upright
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000';
      ctx.font = '14px Arial';
      ctx.fillText(section.icon, 0, -13);

      // Wrap text
      const words = section.label.split(' ');
      let line = '';
      const lineHeight = 15;
      let y = 0;

      // Add clickable area coordinates to the section
      section.clickableArea = {
        x: labelX - 35,
        y: labelY - 20,
        width: 70,
        height: 60
      };

      for (let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > 70 && n > 0) {
          ctx.fillText(line, 0, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 0, y);

      ctx.restore();
    }

    function handleCanvasClick(this: AfterLoginPageComponent, event: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      for (const section of sections) {
        const area = section.clickableArea;
        if (area && x >= area.x && x <= area.x + area.width && y >= area.y && y <= area.y + area.height) {
          this.router.navigate([section.link]); // Use 'this.router' to navigate
        }
      }
    }

    function drawRocket() {
      const rocketX = centerX + radius * Math.cos(angle);
      const rocketY = centerY + radius * Math.sin(angle);

      // Save the rocket's position to the trail
      trail.push({
        x: rocketX,
        y: rocketY
      });

      // Draw the exhaust trail
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);
      for (let i = 1; i < trail.length; i++) {
        ctx.lineTo(trail[i].x, trail[i].y);
      }
      ctx.strokeStyle = '#8ED973';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.save();
      ctx.translate(rocketX, rocketY);
      ctx.rotate(angle + Math.PI / 1.3); // Rotate the rocket to face the direction of travel
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000';
      ctx.font = '30px Arial';
      ctx.fillText('🚀', 0, 0);
      ctx.restore();

      angle += speed;

      // Limit the length of the trail
      if (trail.length > 100) {
        trail.shift();
      }
    }

    function drawDiagram() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      drawCircle();
      drawInnerCircle();
      drawText();
      drawRocket();
      drawAllSections();

      requestAnimationFrame(drawDiagram); // Animate continuously
    }

    function drawAllSections() {
      for (let i = 0; i < index; i++) {
        drawSection(sections[i]);
      }
    }

    function drawSectionsSequentially() {
      if (index < sections.length) {
        index++;
        setTimeout(drawSectionsSequentially, 500); // Delay between each section
      }
    }

    canvas.addEventListener('click', handleCanvasClick.bind(this));

    drawCircle();
    drawInnerCircle();
    drawText();
    drawSectionsSequentially();
    drawDiagram();
  }
}
