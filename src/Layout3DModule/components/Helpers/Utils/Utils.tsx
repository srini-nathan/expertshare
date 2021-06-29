import { Euler, Object3D, Vector3 } from "three";
import { OrbitControls } from "three-stdlib";

export const ROOM_FADE_DURATION = 500;

export const PANEL_ANIMATION_DURATION = 400;

export const FOV_ANIMATION_DURATION = 1500;

// convert degrees to radians
export const degToRad = (deg: number): number => {
    return (deg * Math.PI) / 180;
};

// convert radians to degrees
export const radToDeg = (rad: number): number => {
    return (rad * 180) / Math.PI;
};

// Apply parameters to OrbitControls when EDIT MODE is changed
export const setParamsToOrbitControls = (
    controls: OrbitControls,
    target: Vector3,
    rotationSpeed: number,
    enableZoom: boolean,
    minDistance: number,
    minZoom: number,
    zoom0: number
): void => {
    controls.target = target;
    controls.rotateSpeed = rotationSpeed;
    controls.enableZoom = enableZoom;
    controls.minDistance = minDistance;
    // controls.minZoom = minZoom;
    controls.zoom0 = zoom0;
    controls.update();
};

// Normalize rotation so the camera doean't spin around its axis
export const normalizeRotation = (
    fromRotation: Euler,
    toRotation: Euler,
    inverse = false
): Euler => {
    // console.log("from : ", fromRotation.x, " toX: ", toRotation.x);
    // console.log("from Y: ", fromRotation.y, " to Y: ", toRotation.y);

    // if (fromRotation.x >= Math.PI - 0.001) fromRotation.x -= Math.PI;
    // if (fromRotation.x <= Math.PI + 0.001) fromRotation.x += Math.PI;

    // if (fromRotation.z >= Math.PI - 0.001) fromRotation.z -= Math.PI;
    // if (fromRotation.z <= Math.PI + 0.001) fromRotation.z += Math.PI;

    // if (fromRotation.y >= Math.PI - 0.001) fromRotation.y -= Math.PI;
    // if (fromRotation.y <= Math.PI + 0.001) fromRotation.y += Math.PI;
    // // if (toRotation.z >= Math.PI - 0.001) toRotation.z -= Math.PI;
    // if (toRotation.z <= Math.PI + 0.001) toRotation.z += Math.PI;

    // if (fromRotation.z - toRotation.z <= -Math.PI / 2) {
    //     if (inverse) fromRotation.z += Math.PI;
    //     else toRotation.z -= Math.PI;
    // }

    // console.log("rotation difference X: ", fromRotation.x - toRotation.x);
    // console.log("rotation difference Y: ", fromRotation.y - toRotation.y);
    // console.log("rotation difference Z: ", fromRotation.z - toRotation.z);

    while (fromRotation.x - toRotation.x >= Math.PI) {
        if (inverse) fromRotation.x -= 2 * Math.PI;
        else toRotation.x += 2 * Math.PI;
    }
    while (fromRotation.x - toRotation.x <= -Math.PI) {
        if (inverse) fromRotation.x += 2 * Math.PI;
        else toRotation.x -= 2 * Math.PI;
    }

    while (fromRotation.y - toRotation.y >= Math.PI) {
        if (inverse) fromRotation.y -= 2 * Math.PI;
        else toRotation.y += 2 * Math.PI;
    }
    while (fromRotation.y - toRotation.y <= -Math.PI) {
        if (inverse) fromRotation.y += 2 * Math.PI;
        else toRotation.y -= 2 * Math.PI;
    }

    while (fromRotation.z - toRotation.z >= Math.PI) {
        if (inverse) fromRotation.z -= 2 * Math.PI;
        else toRotation.z += 2 * Math.PI;
    }
    while (fromRotation.z - toRotation.z <= -Math.PI) {
        if (inverse) fromRotation.z += 2 * Math.PI;
        else toRotation.z -= 2 * Math.PI;
    }

    // while (fromRotation.x < -Math.PI) fromRotation.x += 2 * Math.PI;
    // while (fromRotation.y < -Math.PI) fromRotation.y += 2 * Math.PI;
    // while (fromRotation.z < -Math.PI) fromRotation.z += 2 * Math.PI;

    // while (fromRotation.x > Math.PI) fromRotation.x -= 2 * Math.PI;
    // while (fromRotation.y > Math.PI) fromRotation.y -= 2 * Math.PI;
    // while (fromRotation.z > Math.PI) fromRotation.z -= 2 * Math.PI;

    // while (toRotation.x < -Math.PI) toRotation.x += 2 * Math.PI;
    // while (toRotation.y < -Math.PI) toRotation.y += 2 * Math.PI;
    // while (toRotation.z < -Math.PI) toRotation.z += 2 * Math.PI;

    // while (toRotation.x > Math.PI) toRotation.x -= 2 * Math.PI;
    // while (toRotation.y > Math.PI) toRotation.y -= 2 * Math.PI;
    // while (toRotation.z > Math.PI) toRotation.z -= 2 * Math.PI;

    return inverse ? fromRotation : toRotation;
};

// Apply rotation to camera - used in spring onChange
export const applyRotationToCamera = (
    camera: Object3D,
    rotation: { x: number; y: number; z: number } | Euler
): void => {
    if (camera) {
        camera.rotation.set(rotation.x, rotation.y, rotation.z);
    }
};
