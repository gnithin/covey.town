export default {
    DEFAULT_BROADCAST_RADIUS: 80,
    PHASER_PROPORTION_OF_SCREEN: 0.7,
    PHASER_HEIGHT: 700,
    CUSTOM_PRIORITY_FOCUS_CLASS_FOR_INPUT: "custom-focus-input-field",
    get PRIORITY_FOCUS_CLASSES(): string[] {
        return [this.CUSTOM_PRIORITY_FOCUS_CLASS_FOR_INPUT, "ql-editor"]
    }
}
