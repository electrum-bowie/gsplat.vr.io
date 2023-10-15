AFRAME.registerComponent('simple-fly', {
    schema: {
        speed: { type: 'number', default: 0.1 }
    },
    init: function () {
        this.rightController = null;
        this.isFlying = false;
        this.initialized = false;
        const controllers = document.querySelectorAll('a-entity[oculus-touch-controls]');
        if (controllers.length >= 2) {
            this.rightController = controllers[0]; // Use 0 for the right hand
            this.rightController.addEventListener('triggerdown', () => {
                this.startFlying();
                console.log('Flying started');
            });
            this.rightController.addEventListener('triggerup', () => {
                this.stopFlying();
                console.log('Flying stopped');
            });
        } else {
            console.warn('No Oculus Touch controllers found.');
        }
    },
    tick: function () {
        
        if (!this.gaussianSplattingEntity) {
            console.warn('No Gaussian Splatting entity found.');

            this.gaussianSplattingEntity = document.querySelector('[gaussian_splatting]');

        }

       
        if (this.gaussianSplattingEntity) {
            if (this.isFlying) {
                this.fly();
            }
            const entity = document.querySelector("a-scene");
            // Check if the component has already been initialized
            if (!this.initialized) {
                // Call the `init` method
                entity.components["gaussian_splatting"].init();

                // Set the initialized flag to true
                this.initialized = true;
            }
        }

    },
    startFlying: function () {
        this.isFlying = true;
        console.log('Start flying...');
    },
    stopFlying: function () {
        this.isFlying = false;
        console.log('Stop flying.');
    },
    fly: function () {
        if (this.rightController && this.gaussianSplattingEntity) {
            const direction = new THREE.Vector3();
            this.rightController.object3D.getWorldDirection(direction);
            direction.multiplyScalar(this.data.speed); // Invert the direction for the opposite translation
            this.gaussianSplattingEntity.object3D.position.add(direction.clone().negate());
            console.log('Flying in the opposite direction.');
        } else {
            console.warn('Right controller or Gaussian Splatting entity not found.');
        }
    }
});
