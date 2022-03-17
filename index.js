// NOTE: Not a Quad yet
export function Quad() {
    this.program = null;
    this.vertexArray = null;
    this.source = {
        vert: `#version 300 es
in vec2 a_position;
in vec2 a_texcoord;

out vec2 v_texcoord;

void main() {
    v_texcoord = a_texcoord;
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`,
        frag: `#version 300 es
precision highp float;

in vec2 v_texcoord;
uniform sampler2D u_texture;
out vec4 outColor;

void main() {
    outColor = texture(u_texture, v_texcoord);
}
`,
    };
}

Quad.prototype.mount = function (gl) {
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, this.source.vert);
    const fragmentShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        this.source.frag
    );
    this.program = createProgram(gl, vertexShader, fragmentShader);

    // Attributes
    const positions = [-1, -1, -1, 1, 1, 1, 1, 1, 1, -1, -1, -1];
    const positionAttributeLocation = gl.getAttribLocation(
        this.program,
        "a_position"
    );
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Vertex attribute object
    this.vertexArray = gl.createVertexArray();
    gl.bindVertexArray(this.vertexArray);

    // Tell WebGL how to pull a_position out of buffer
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Buffer for a_texcoord
    const texcoordAttributeLocation = gl.getAttribLocation(
        this.program,
        "a_texcoord"
    );

    // Bind ARRAY_BUFFER to texcoord location
    gl.enableVertexAttribArray(texcoordAttributeLocation);

    // Fill buffer with data
    const uvs = [0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0];
    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);

    // Tell WebGL how to pull a_texcoord out of buffer
    gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Create texture and fill it with fake data
    const px = 2;
    const py = 2;
    const pixels = new Uint8Array([
        0, 0, 255, 255, 0, 255, 0, 255, 255, 0, 0, 255, 255, 0, 255, 255,
    ]);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        px,
        py,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixels
    );
    gl.generateMipmap(gl.TEXTURE_2D)

    // Configure repeat and interpolation of texture
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
};

Quad.prototype.render = function (gl) {
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vertexArray);

    const offset = 0;
    const count = 6;
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
