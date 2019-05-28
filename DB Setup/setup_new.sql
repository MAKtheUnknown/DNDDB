-- MySQL Workbench Forward Engineering

SET UNIQUE_CHECKS=0;
SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema DND
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema DND
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `DND` DEFAULT CHARACTER SET latin1 ;
USE `DND` ;

-- -----------------------------------------------------
-- Table `DND`.`Location`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DND`.`Location` (
  `idLocation` INT NOT NULL,
  `location_name` VARCHAR(45) NULL,
  `location_description` TEXT NULL,
  `superLocation_idLocation` INT NOT NULL,
  PRIMARY KEY (`idLocation`),
  INDEX `fk_Location_Location_idx` (`superLocation_idLocation` ASC),
  CONSTRAINT `fk_Location_Location`
    FOREIGN KEY (`superLocation_idLocation`)
    REFERENCES `DND`.`Location` (`idLocation`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DND`.`Creature`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DND`.`Creature` (
  `idCreature` INT NOT NULL,
  `creature_name` VARCHAR(45) NULL,
  `creature_description` TEXT NULL,
  `hp` INT NULL,
  `xp` INT NULL,
  `ac` INT NULL,
  `speed` INT NULL,
  `str` INT NULL,
  `dex` INT NULL,
  `wis` INT NULL,
  `int` INT NULL,
  `con` INT NULL,
  `cha` INT NULL,
  `template_idCreature` INT NULL,
  PRIMARY KEY (`idCreature`),
  INDEX `fk_Creature_Creature1_idx` (`template_idCreature` ASC),
  CONSTRAINT `fk_Creature_Creature1`
    FOREIGN KEY (`template_idCreature`)
    REFERENCES `DND`.`Creature` (`idCreature`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DND`.`CreatureAppearance`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DND`.`CreatureAppearance` (
  `Location_idLocation` INT NOT NULL,
  `Creature_idCreature` INT NOT NULL,
  `appearance_specific_information` TEXT NULL,
  PRIMARY KEY (`Location_idLocation`, `Creature_idCreature`),
  INDEX `fk_CreatureAppearance_Location1_idx` (`Location_idLocation` ASC),
  INDEX `fk_CreatureAppearance_Creature1_idx` (`Creature_idCreature` ASC),
  CONSTRAINT `fk_CreatureAppearance_Location1`
    FOREIGN KEY (`Location_idLocation`)
    REFERENCES `DND`.`Location` (`idLocation`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_CreatureAppearance_Creature1`
    FOREIGN KEY (`Creature_idCreature`)
    REFERENCES `DND`.`Creature` (`idCreature`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DND`.`Attack`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DND`.`Attack` (
  `idAttack` INT NOT NULL,
  `attack_modifier` INT NOT NULL,
  `attack_info` TEXT NULL,
  PRIMARY KEY (`idAttack`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DND`.`Damage`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DND`.`Damage` (
  `idDamage` INT NOT NULL,
  `damage_type` ENUM('acid', 'bludgeoning', 'cold', 'fire', 'force', 'lightning', 'necrotic', 'piercing', 'poison', 'psychic', 'radiant', 'slashing', 'thunder') NULL,
  `damage_roll` VARCHAR(45) NOT NULL,
  `Attack_idAttack` INT NULL,
  PRIMARY KEY (`idDamage`),
  INDEX `fk_Damage_Attack1_idx` (`Attack_idAttack` ASC),
  CONSTRAINT `fk_Damage_Attack1`
    FOREIGN KEY (`Attack_idAttack`)
    REFERENCES `DND`.`Attack` (`idAttack`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DND`.`CreatureAttack`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DND`.`CreatureAttack` (
  `Attack_idAttack` INT NOT NULL,
  `Creature_idCreature` INT NOT NULL,
  `creature_attack_description` TEXT NULL,
  PRIMARY KEY (`Attack_idAttack`, `Creature_idCreature`),
  INDEX `fk_Attack_has_Creature_Creature1_idx` (`Creature_idCreature` ASC),
  INDEX `fk_Attack_has_Creature_Attack1_idx` (`Attack_idAttack` ASC),
  CONSTRAINT `fk_Attack_has_Creature_Attack1`
    FOREIGN KEY (`Attack_idAttack`)
    REFERENCES `DND`.`Attack` (`idAttack`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Attack_has_Creature_Creature1`
    FOREIGN KEY (`Creature_idCreature`)
    REFERENCES `DND`.`Creature` (`idCreature`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DND`.`PlayerCharacter`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DND`.`PlayerCharacter` (
  `idPlayerCharacter` INT NOT NULL,
  `pc_name` VARCHAR(45) NOT NULL,
  `pc_xp` VARCHAR(45) NULL,
  PRIMARY KEY (`idPlayerCharacter`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DND`.`Item`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DND`.`Item` (
  `idItem` INT NOT NULL,
  `item_name` VARCHAR(45) NULL,
  `item_description` TEXT NULL,
  `Location_idLocation` INT NULL,
  `Creature_idCreature` INT NULL,
  `PlayerCharacter_idPlayerCharacter` INT NULL,
  PRIMARY KEY (`idItem`),
  INDEX `fk_Item_Location1_idx` (`Location_idLocation` ASC),
  INDEX `fk_Item_Creature1_idx` (`Creature_idCreature` ASC),
  INDEX `fk_Item_PlayerCharacter1_idx` (`PlayerCharacter_idPlayerCharacter` ASC),
  CONSTRAINT `fk_Item_Location1`
    FOREIGN KEY (`Location_idLocation`)
    REFERENCES `DND`.`Location` (`idLocation`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Item_Creature1`
    FOREIGN KEY (`Creature_idCreature`)
    REFERENCES `DND`.`Creature` (`idCreature`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Item_PlayerCharacter1`
    FOREIGN KEY (`PlayerCharacter_idPlayerCharacter`)
    REFERENCES `DND`.`PlayerCharacter` (`idPlayerCharacter`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `DND`.`ItemAttack`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `DND`.`ItemAttack` (
  `Item_idItem` INT NOT NULL,
  `Attack_idAttack` INT NOT NULL,
  PRIMARY KEY (`Item_idItem`, `Attack_idAttack`),
  INDEX `fk_Item_has_Attack_Attack1_idx` (`Attack_idAttack` ASC),
  INDEX `fk_Item_has_Attack_Item1_idx` (`Item_idItem` ASC),
  CONSTRAINT `fk_Item_has_Attack_Item1`
    FOREIGN KEY (`Item_idItem`)
    REFERENCES `DND`.`Item` (`idItem`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Item_has_Attack_Attack1`
    FOREIGN KEY (`Attack_idAttack`)
    REFERENCES `DND`.`Attack` (`idAttack`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;