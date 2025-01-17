/* Assignment 4: So You Think Ants Can Dance
 * CSCI 4611, Fall 2022, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'
import { Skeleton } from './Skeleton'
import { MotionClip } from './MotionClip'
import { Pose } from './Pose';
import { Bone } from './Bone';

export class AnimatedCharacter extends gfx.Transform3
{
    public skeleton: Skeleton;
    public fps: number;
    public useAbsolutePosition: boolean;
    
    private clip: MotionClip | null;
    
    private currentTime: number;
    private currentPose: Pose;
    
    private overlayQueue: MotionClip[];
    private overlayTransitionFrames: number[];
    private overlayTime: number;
    private overlayPose: Pose;

    constructor(fps = 60, useAbsolutePosition = true)
    {
        super();
        // Create skeleton and add it as a child
        this.skeleton = new Skeleton();
        this.add(this.skeleton);

        this.fps = fps;
        this.useAbsolutePosition = useAbsolutePosition;

        this.clip = null;

        this.currentTime = 0;
        this.currentPose = new Pose();
        
        this.overlayQueue = [];
        this.overlayTransitionFrames = [];
        this.overlayTime = 0;  
        this.overlayPose = new Pose();
    }

    createMeshes(): void
    {
        // Drawing the coordinate axes is a good way to check your work.
        // To start, this will just create the axes for the root node of the
        // character, but once you add this to createMeshesRecursive, you 
        // can draw the axes for each bone.  The visibility of the axes
        // is toggled using a checkbox.
        const axes = new gfx.Axes3(0.15);
        this.skeleton.add(axes);

        // Call the recursive method for each root bone
        this.skeleton.rootBones.forEach((rootBone: Bone) => {
            this.createMeshesRecursive(rootBone)
        });
    }

    private createMeshesRecursive(bone: Bone): void
    {
        // TO DO (PART 1): Draw the coordinate axes for the bone
        const axes = new gfx.Axes3(0.15);
        axes.rotation.lookAt(this.currentPose.rootPosition, bone.transform.position);
        
        bone.transform.add(axes);

        

        // TO DO (PART 3): You will want to draw something different for each
        // part of the body. An if statement like this is an easy way
        // to do that.  You can find the names of additional bones in 
        // the .asf files.  Anything that you create will be automatically
        // be made invisible when the coordinate axes are visibile.
        const headMaterial = new gfx.GouraudMaterial();
        headMaterial.ambientColor.set(0.945, 0.749, 0.6);
        headMaterial.diffuseColor.set(0.945, 0.749, 0.6);

        const blackMaterial = new gfx.GouraudMaterial();
        blackMaterial.ambientColor.set(0, 0, 0);
        blackMaterial.diffuseColor.set(0, 0, 0);

        const bodyMaterial = new gfx.GouraudMaterial();
        bodyMaterial.ambientColor.set(1, 0.6, 0.07);
        bodyMaterial.diffuseColor.set(1, 0.6, 0.07);

        const whiteMaterial = new gfx.GouraudMaterial();
        whiteMaterial.ambientColor.set(1, 0.6, 0.8863);
        whiteMaterial.diffuseColor.set(1, 0.6, 0.8863);




        if(bone.name == 'head')
        {

            const sphere = new gfx.SphereMesh(0.1, 1);
            sphere.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            sphere.rotateZ(gfx.MathUtils.degreesToRadians(-15));
            sphere.scale.z = 1.3;
            sphere.material = headMaterial;
            bone.transform.add(sphere);

            const leye = new gfx.SphereMesh(0.015);
            leye.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            leye.translateX(0.0866);
            leye.translateY(0.05);
            leye.translateZ(-0.05);
            leye.material = blackMaterial;
            bone.transform.add(leye);

            const reye = new gfx.SphereMesh(0.015);
            reye.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            reye.translateY(0.0866);
            reye.translateX(0.05);
            reye.translateZ(-0.05);
            reye.material = blackMaterial;
            bone.transform.add(reye);

            const nose = new gfx.ConeMesh(0.02, 0.1);
            nose.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            nose.rotateZ(gfx.MathUtils.degreesToRadians(-45));
            nose.translateY(0.12);
            // nose.translateX(0.08);
            nose.translateZ(0.005);
            nose.material = whiteMaterial;
            bone.transform.add(nose);
        }
        else if(bone.name == 'lhipjoint')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }
        else if(bone.name == 'rhipjoint')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }
        else if(bone.name == 'lfemur')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }
        else if(bone.name == 'rfemur')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }
        else if(bone.name == 'ltibia')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }
        else if(bone.name == 'rtibia')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }
        else if(bone.name == 'lfoot')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }
        else if(bone.name == 'rfoot')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }
        else if(bone.name == 'ltoes')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }
        else if(bone.name == 'rtoes')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }


        else if(bone.name == 'lowerback')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = bodyMaterial;
            bone.transform.add(box);

            const Sphere = new gfx.SphereMesh(bone.length, 2);
            Sphere.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            // Sphere.rotateY(gfx.MathUtils.degreesToRadians(30));
            // Sphere.rotateX(gfx.MathUtils.degreesToRadians(60));
            Sphere.scale.z = 2;
            Sphere.translateZ(bone.length*1.2);
            Sphere.material = bodyMaterial;
            bone.transform.add(Sphere);
        }
        else if(bone.name == 'upperback')
        {
            const sphere = new gfx.SphereMesh(bone.length*2/3, 2);
            sphere.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            sphere.translateZ(-bone.length*1/3);
            sphere.material = bodyMaterial;
            bone.transform.add(sphere);
        }
        else if(bone.name == 'thorax')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = bodyMaterial;
            bone.transform.add(box);

            const sphere = new gfx.SphereMesh(bone.length*2/3, 2);
            sphere.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            sphere.translateZ(-bone.length*1/3);
            sphere.material = bodyMaterial;
            bone.transform.add(sphere);
        }
        else if(bone.name == 'lowerneck')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = bodyMaterial;
            bone.transform.add(box);

            const cylinder = new gfx.CylinderMesh(6, bone.length*2/3);
            cylinder.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            cylinder.scale.set(0.1,1,0.1);
            cylinder.translateZ(-bone.length/2)
            cylinder.rotateX(gfx.MathUtils.degreesToRadians(90));
            cylinder.material = whiteMaterial;
            bone.transform.add(cylinder);

        }
        else if(bone.name == 'upperneck')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2)
            bone.transform.add(box);
        }

        else if(bone.name == 'lclavicle')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }
        else if(bone.name == 'lhumerus')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }
        else if(bone.name == 'lradius')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }
        else if(bone.name == 'lwrist')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }
        else if(bone.name == 'lhand')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }
        else if(bone.name == 'lfingers')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }
        else if(bone.name == 'lthumb')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }

        else if(bone.name == 'rclavicle')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }
        else if(bone.name == 'rhumerus')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }
        else if(bone.name == 'rradius')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }
        else if(bone.name == 'rwrist')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }
        else if(bone.name == 'rhand')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }
        else if(bone.name == 'rfingers')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }
        else if(bone.name == 'rthumb')
        {
            const box = new gfx.BoxMesh(0.01, 0.01, bone.length);
            box.rotation.lookAt(this.currentPose.rootPosition, bone.direction);
            box.translateZ(bone.length/2);
            box.material = blackMaterial;
            bone.transform.add(box);
        }




        // TO DO (PART 1): Recursively call this function for each of the bone's children
        bone.children.forEach((child:Bone) =>{
            this.createMeshesRecursive(child);
            
        });
    }

    loadSkeleton(filename: string): void
    {
        this.skeleton.loadFromASF(filename);
    }

    loadMotionClip(filename: string): MotionClip
    {
        const clip = new MotionClip();
        clip.loadFromAMC(filename, this.skeleton);
        return clip;
    }

    play(clip: MotionClip): void
    {
        this.stop();
        this.clip = clip;
        this.currentPose = this.clip.frames[0];
    }

    stop(): void
    {
        this.clip = null;
        this.currentTime = 0;

        this.overlayQueue = [];
        this.overlayTransitionFrames = [];
        this.overlayTime = 0;
    }

    overlay(clip: MotionClip, transitionFrames: number): void
    {
        this.overlayQueue.push(clip);
        this.overlayTransitionFrames.push(transitionFrames);
    }

    update(deltaTime: number): void
    {
        // If the motion queue is empty, then do nothing
        if(!this.clip)
            return;

        // Advance the time
        this.currentTime += deltaTime;

        // Set the next frame number
        let currentFrame = Math.floor(this.currentTime * this.fps);

        if(currentFrame >= this.clip.frames.length)
        {
            currentFrame = 0;
            this.currentTime = 0;   
            this.currentPose = this.clip.frames[0];
        }

        let overlayFrame = 0;

        // Advance the overlay clip if there is one
        if(this.overlayQueue.length > 0)
        {
            this.overlayTime += deltaTime;

            overlayFrame = Math.floor(this.overlayTime * this.fps);

            if(overlayFrame >= this.overlayQueue[0].frames.length)
            {
                this.overlayQueue.shift();
                this.overlayTransitionFrames.shift();
                this.overlayTime = 0;
                overlayFrame = 0;
            }
        }

        const pose = this.computePose(currentFrame, overlayFrame);
        this.skeleton.update(pose, this.useAbsolutePosition);
    }

    public getQueueCount(): number
    {
        return this.overlayQueue.length;
    }

    private computePose(currentFrame: number, overlayFrame: number): Pose
    {
        // If there is an active overlay track
        if(this.overlayQueue.length > 0)
        {
            // Start out with the unmodified overlay pose
            const overlayPose = this.overlayQueue[0].frames[overlayFrame].clone();

            let alpha = 0;

            // Fade in the overlay
            if(overlayFrame < this.overlayTransitionFrames[0])
            {
                alpha = 1 - overlayFrame / this.overlayTransitionFrames[0];
                overlayPose.lerp(this.clip!.frames[currentFrame], alpha);
            }
            // Fade out the overlay
            else if (overlayFrame > this.overlayQueue[0].frames.length - this.overlayTransitionFrames[0])
            {
                alpha = 1 - (this.overlayQueue[0].frames.length - overlayFrame) / this.overlayTransitionFrames[0];
                overlayPose.lerp(this.clip!.frames[currentFrame], alpha);
            }

            if(!this.useAbsolutePosition)
            {
                const relativeOverlayPosition = gfx.Vector3.copy(this.overlayQueue[0].frames[overlayFrame].rootPosition);
                relativeOverlayPosition.subtract(this.overlayPose.rootPosition);

                const relativePosition = gfx.Vector3.copy(this.clip!.frames[currentFrame].rootPosition);
                relativePosition.subtract(this.currentPose.rootPosition);

                relativeOverlayPosition.lerp(relativeOverlayPosition, relativePosition, alpha);
                this.position.add(relativeOverlayPosition);

                this.overlayPose = this.overlayQueue[0].frames[overlayFrame];
                this.currentPose = this.clip!.frames[currentFrame];
            }
            
            return overlayPose;
        }
        // Motion is entirely from the base track
        else
        {
            if(!this.useAbsolutePosition)
            {
                const relativePosition = gfx.Vector3.copy(this.clip!.frames[currentFrame].rootPosition);
                relativePosition.subtract(this.currentPose.rootPosition);
                this.position.add(relativePosition);
                this.currentPose = this.clip!.frames[currentFrame];
            }

            return this.clip!.frames[currentFrame];
        }
    }

    // Entry function for the recursive call
    toggleAxes(showAxes: boolean): void
    {
        this.toggleAxesRecursive(this.skeleton, showAxes);
    }

    private toggleAxesRecursive(object: gfx.Transform3, showAxes: boolean): void
    {
        // Set the visibility of the coordinate axes
        if(object instanceof gfx.Axes3)
        {
            object.material.visible = showAxes;
        }
        // Set the visibility of all materials that are not coordinate axes
        else if(object instanceof gfx.Mesh || object instanceof gfx.MeshInstance || object instanceof gfx.Line3)
        {
            object.material.visible = !showAxes;
        }

        // Call the function recursively for each child node
        object.children.forEach((child: gfx.Transform3) => {
            this.toggleAxesRecursive(child, showAxes);
        });
    }
}