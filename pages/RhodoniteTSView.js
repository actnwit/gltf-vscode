
export class RhodoniteTSView {
    constructor() {
        // Tracks if this engine is currently the active engine.
        this._enabled = false;

        this._container = null;
        this._camera = null;
        this._clock = null;
        this._scene = null;
        this._renderer = null;
        this._mixer = null;
        this._orbitControls = null;
        this._backgroundSubscription = undefined;
    }

    _subscribeToAnimUI(anim) {
        anim.active.subscribe(function(newValue) {
            mainViewModel.anyAnimChanged();
            var action = anim.clipAction;
            if (!newValue) {
                action.stop();
            } else {
                action.play();
            }
        });
    }

    _initScene(rootPath, gltfContent) {

    }

    _onWindowResize() {
        if (!this._enabled) {
            return;
        }

        this._camera.aspect = this._container.offsetWidth / this._container.offsetHeight;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }

    _animate() {
        if (!this._enabled) {
            return;
        }

        requestAnimationFrame(() => this._animate());

        if (this._mixer) {
            this._mixer.update(this._clock.getDelta());
        }

        this._orbitControls.update();
        this._renderer.render(this._scene, this._camera);
    }

    /**
    * @function cleanup
    * Perform any cleanup that needs to happen to stop rendering the current model.
    * This is called right before the active engine for the preview window is switched.
    */
    cleanup() {
        if (this._backgroundSubscription) {
            this._backgroundSubscription.dispose();
            this._backgroundSubscription = undefined;
        }
        this._enabled = false;

        if (this._container && this._renderer) {
            this._container.removeChild(this._renderer.domElement);
        }

        this._camera = null;

        mainViewModel.animations([]);
        if (this._mixer) {
            this._mixer.stopAllAction();
        }

        window.removeEventListener('resize', this._resizeHandler, false);
    }

    startPreview() {
        var rev = document.getElementById('RhodoniteTSRevision');
        rev.textContent = 'r' + ;

        var rootPath = document.getElementById('gltfRootPath').textContent;
        var gltfContent = document.getElementById('gltf').textContent;

        this._resizeHandler = () => this._onWindowResize();
        this._enabled = true;
        this._initScene(rootPath, gltfContent);
        this._animate();
        window.addEventListener('resize', this._resizeHandler, false);
    }
}
