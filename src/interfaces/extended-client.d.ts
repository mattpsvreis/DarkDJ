import { Player } from "discord-player";
import { Client, Collection } from "discord.js";

export default interface ExtendedClient extends Client {
  commands: Collection<string, any>;
  player?: Player;
}
