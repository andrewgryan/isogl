export function Quad() {
    this.program = null;
    this.vertexArray = null;
    this.source = {
        vert: `#version 300 es
in vec2 a_position;

void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`,
        frag: `#version 300 es
precision highp float;
out vec4 outColor;

void main() {
    outColor = vec4(0.0, 1.0, 0.2, 1.0);
}
`,
    };
}

Quad.prototype.mount = function(gl) {
    console.log(this)
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, this.source.vert);
    const fragmentShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        this.source.frag
    );
    this.program = createProgram(gl, vertexShader, fragmentShader);

    const positionAttributeLocation = gl.getAttribLocation(
        this.program,
        "a_position"
    );
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [0, 0, 1, 0, 1, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    this.vertexArray = gl.createVertexArray();
    gl.bindVertexArray(this.vertexArray);
    gl.enableVertexAttribArray(positionAttributeLocation);

    const size = 2;
    const normalized = false;
    const stride = 0;
    const offset = 0;
    gl.vertexAttribPointer(
        positionAttributeLocation,
        size,
        gl.FLOAT,
        normalized,
        stride,
        offset
    );
};

Quad.prototype.render = function(gl) {
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vertexArray)

    const offset = 0;
    const count = 3;
    gl.drawArrays(gl.TRIANGLES, offset, count);
};

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

export function renderGl(gl, mesh) {
    // clear canvas
    gl.clearColor(0.1, 0.1, 0.1, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // re-shape canvas viewport
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // TODO separate mounting from rendering
    mesh.mount(gl);
    mesh.render(gl);
}
