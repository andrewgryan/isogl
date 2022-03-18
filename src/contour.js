import { compile } from "./util.js";

export class Contour {
    constructor() {
        this.vertexSource = `#version 300 es
in vec2 a_position;
out vec2 v_position;

void main() {
    v_position = a_position;
    gl_Position = vec4(a_position, 0, 1);
}`;
        this.fragmentSource = `#version 300 es
precision highp float;

in vec2 v_position;
out vec4 outColor;

float circle(in vec2 _st, in float _radius) {
  vec2 dist = _st - vec2(0.5);
  float dr = _radius * 0.01;
  return 1.0 - smoothstep(_radius - dr, _radius + dr, dot(dist, dist) * 4.0);
}

void main() {
    vec2 rg = (0.5 * v_position.xy) + 0.5;

    // Circle
    outColor = vec4(circle(rg, 0.9)) * vec4(0.8, 0.2, 0.2, 1.0);

}`;

        this.program = null;
        this.vertexArray = null;
        this.offset = 0;
        this.count = 6;
    }

    mount(gl) {
        this.program = compile(gl, this.vertexSource, this.fragmentSource);
        this.attributes = [
            {
                location: gl.getAttribLocation(this.program, "a_position"),
                buffer: gl.createBuffer(),
                data: new Float32Array([
                    -1, -1, -1, 1, 1, 1, 1, 1, 1, -1, -1, -1,
                ]),
                size: 2,
                type: gl.FLOAT,
                normalized: false,
                stride: 0,
                offset: 0,
            },
        ];

        for (let attribute of this.attributes) {
            gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
            gl.bufferData(gl.ARRAY_BUFFER, attribute.data, gl.STATIC_DRAW);
        }

        this.vertexArray = gl.createVertexArray();
        gl.bindVertexArray(this.vertexArray);

        for (let attribute of this.attributes) {
            const { location, size, type, offset, normalized, stride } =
                attribute;
            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(
                location,
                size,
                type,
                normalized,
                stride,
                offset
            );
        }
    }

    render(gl) {
        gl.useProgram(this.program);
        gl.bindVertexArray(this.vertexArray);
        gl.drawArrays(gl.TRIANGLES, this.offset, this.count);
    }
}
