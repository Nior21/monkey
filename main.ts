enum ActionKind {
    Walking,
    Idle,
    Jumping
}
namespace SpriteKind {
    export const crosshaire = SpriteKind.create()
    export const Text = SpriteKind.create()
    export const StatusBar = SpriteKind.create()
}
controller.anyButton.onEvent(ControllerButtonEvent.Pressed, function () {
    if (controller.B.isPressed()) {
        controller.moveSprite(mySprite, 0, 0)
        if (!(sprites.readDataBoolean(crosshaire, "active"))) {
            crosshaire = sprites.createProjectileFromSprite(assets.image`blank`, mySprite, 0, 0)
            mySprite.sayText("" + Math.round(crosshaire.x) + ":" + Math.round(crosshaire.y))
            if (sprites.readDataBoolean(mySprite, "isRight")) {
                crosshaire.setPosition(Math.round(mySprite.x) + 16, Math.round(mySprite.y))
                aimX = 75
            } else {
                crosshaire.setPosition(Math.round(mySprite.x) - 16, Math.round(mySprite.y))
                aimX = -75
            }
            sprites.setDataBoolean(crosshaire, "active", true)
        }
        if (controller.left.isPressed()) {
            crosshaire.setPosition(Math.round(mySprite.x) - 16, Math.round(mySprite.y))
            aimX = -75
            mySprite.setImage(assets.image`standLeft`)
            sprites.setDataBoolean(mySprite, "isRight", false)
        } else if (controller.right.isPressed()) {
            crosshaire.setPosition(Math.round(mySprite.x) + 16, Math.round(mySprite.y))
            aimX = 75
            mySprite.setImage(assets.image`standRight`)
            sprites.setDataBoolean(mySprite, "isRight", true)
        } else if (controller.up.isPressed()) {
            crosshaire.setPosition(crosshaire.x, crosshaire.y - 4)
            aimY = aimY - 4
        } else if (controller.down.isPressed()) {
            crosshaire.setPosition(crosshaire.x, crosshaire.y + 4)
            aimY = aimY + 4
        } else {
            aimY = 0
        }
    } else {
        controller.moveSprite(mySprite, 100, 0)
        if (controller.left.isPressed()) {
            animation.runImageAnimation(
            mySprite,
            assets.animation`walk left`,
            150,
            false
            )
            sprites.setDataBoolean(mySprite, "isRight", false)
        } else if (controller.right.isPressed()) {
            animation.runImageAnimation(
            mySprite,
            assets.animation`walk right`,
            150,
            false
            )
            sprites.setDataBoolean(mySprite, "isRight", true)
        } else if (controller.up.isPressed()) {
            simplified.gravity_jump(mySprite)
            animation.runImageAnimation(
            mySprite,
            assets.animation`jump`,
            150,
            false
            )
        } else {
            aimY = 0
        }
    }
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    tiles.setWallAt(tiles.locationInDirection(tiles.locationOfSprite(mySprite), CollisionDirection.Bottom), true)
    tiles.setTileAt(tiles.locationInDirection(tiles.locationOfSprite(mySprite), CollisionDirection.Bottom), assets.tile`bounce`)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`orange bauble`, function (sprite, location) {
    tiles.setTileAt(location, assets.tile`transparency16`)
    info.changeScoreBy(1)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`chest2`, function (sprite, location) {
    game.over(true)
})
controller.B.onEvent(ControllerButtonEvent.Released, function () {
    mySprite.sayText("" + aimX + ":" + Math.map(aimY, 0, 16, 0, 75), 500, false)
    projectile = sprites.createProjectileFromSprite(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . 4 4 . . . . . . . 
        . . . . . . 4 5 5 4 . . . . . . 
        . . . . . . 2 5 5 2 . . . . . . 
        . . . . . . . 2 2 . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `, mySprite, aimX, Math.map(aimY, 0, 16, 0, 75))
    sprites.setDataBoolean(crosshaire, "active", false)
    projectile.setFlag(SpriteFlag.ShowPhysics, true)
    projectile.setFlag(SpriteFlag.BounceOnWall, true)
    sprites.destroy(crosshaire)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`chest1`, function (sprite, location) {
    scene.setBackgroundImage(assets.image`background2`)
    tiles.setTilemap(tilemap`level2`)
    animation.runMovementAnimation(
    mySprite,
    animation.animationPresets(animation.flyToCenter),
    100,
    false
    )
    mySprite.say("Level 2!", 500)
})
scene.onHitWall(SpriteKind.Projectile, function (sprite, location) {
    sprite.setVelocity(0, 0)
    tiles.setTileAt(location, img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . 4 . . . . . 
        . . . . 2 . . . . 4 4 . . . . . 
        . . . . 2 4 . . 4 5 4 . . . . . 
        . . . . . 2 4 d 5 5 4 . . . . . 
        . . . . . 2 5 5 5 5 4 . . . . . 
        . . . . . . 2 5 5 5 5 4 . . . . 
        . . . . . . 2 5 4 2 4 4 . . . . 
        . . . . . . 4 4 . . 2 4 4 . . . 
        . . . . . 4 4 . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `)
    timer.after(100, function () {
        tiles.setTileAt(location, img`
            . 3 . . . . . . . . . . . 4 . . 
            . 3 3 . . . . . . . . . 4 4 . . 
            . 3 d 3 . . 4 4 . . 4 4 d 4 . . 
            . . 3 5 3 4 5 5 4 4 d d 4 4 . . 
            . . 3 d 5 d 1 1 d 5 5 d 4 4 . . 
            . . 4 5 5 1 1 1 1 5 1 1 5 4 . . 
            . 4 5 5 5 5 1 1 5 1 1 1 d 4 4 . 
            . 4 d 5 1 1 5 5 5 1 1 1 5 5 4 . 
            . 4 4 5 1 1 5 5 5 5 5 d 5 5 4 . 
            . . 4 3 d 5 5 5 d 5 5 d d d 4 . 
            . 4 5 5 d 5 5 5 d d d 5 5 4 . . 
            . 4 5 5 d 3 5 d d 3 d 5 5 4 . . 
            . 4 4 d d 4 d d d 4 3 d d 4 . . 
            . . 4 5 4 4 4 4 4 4 4 4 4 . . . 
            . 4 5 4 . . 4 4 4 . . . 4 4 . . 
            . 4 4 . . . . . . . . . . 4 4 . 
            `)
    })
    timer.after(200, function () {
        tiles.setTileAt(location, img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . b b . b b b . . . . . 
            . . . . b 1 1 b 1 1 1 b . . . . 
            . . b b 3 1 1 d d 1 d d b b . . 
            . b 1 1 d d b b b b b 1 1 b . . 
            . b 1 1 1 b . . . . . b d d b . 
            . . 3 d d b . . . . . b d 1 1 b 
            . b 1 d 3 . . . . . . . b 1 1 b 
            . b 1 1 b . . . . . . b b 1 d b 
            . b 1 d b . . . . . . b d 3 d b 
            . b b d d b . . . . b d d d b . 
            . b d d d d b . b b 3 d d 3 b . 
            . . b d d 3 3 b d 3 3 b b b . . 
            . . . b b b d d d d d b . . . . 
            . . . . . . b b b b b . . . . . 
            `)
    })
    timer.after(300, function () {
        tiles.setWallAt(location, false)
        tiles.setTileAt(location, assets.tile`transparency16`)
        info.changeScoreBy(1)
    })
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`poison pit`, function (sprite, location) {
    game.over(false)
})
let projectile: Sprite = null
let aimY = 0
let aimX = 0
let crosshaire: Sprite = null
let mySprite: Sprite = null
scene.setBackgroundImage(assets.image`background`)
tiles.setTilemap(tilemap`level1`)
mySprite = sprites.create(assets.image`standRight`, SpriteKind.Player)
sprites.setDataBoolean(mySprite, "isRight", true)
let angle = 90
mySprite.ay = 500
scene.cameraFollowSprite(mySprite)
