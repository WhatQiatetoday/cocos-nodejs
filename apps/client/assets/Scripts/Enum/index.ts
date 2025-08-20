export enum FsmParamTypeEnum {
  Number = "Number",
  Trigger = "Trigger",
}

export enum ParamsNameEnum {
  Idle = "Idle",
  Run = "Run",
  Attack = "Attack",
}

export enum EventEnum {
  WeaponShoot = "WeaponShoot",
  ExplosionBorn = "ExplosionBorn",
  BulletBorn = "BulletBorn",
  ClientSync = "ClientSync",
}

export enum PrefabPathEnum {
  Map = 'Prefab/Map',
  Actor1 = 'Prefab/Actor',
  Weapon1 = 'Prefab/Weapon1',
  Bullet2 = 'Prefab/Bullet2',
  Explosion = 'Prefab/Explosion',
}

export enum EntityStateEnum {
  Idle = "Idle",
  Run = "Run",
  Attack = "Attack",
}

export enum TexturePathEnum {
  Actor1Idle = "texture/actor/actor1/idle",
  Actor1Run = "texture/actor/actor1/run",
  Weapon1Idle = "texture/weapon/weapon1/idle",
  Weapon1Attack = "texture/weapon/weapon1/attack",
  Bullet2Idle = "texture/bullet/bullet2",
  ExplosionIdle = "texture/explosion",

}

export enum SceneEnum {
  Login = "Login",
  Battle = "Battle",
  Hall = "Hall",
}
