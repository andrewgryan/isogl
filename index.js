export { Shape } from "./src/shape.js";
export { Quad } from "./src/quad.js";

export function renderGl(gl, mesh) {
    // clear canvas
    gl.clearColor(0.1, 0.1, 0.1, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // re-shape canvas viewport
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Mount and render
    mesh.mount(gl);
    mesh.render(gl);
}
