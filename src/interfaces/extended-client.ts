import { Client, Collection } from 'discord.js';
import { Player } from 'discord-player';

export default interface ExtendedClient extends Client {
  commands: Collection<string, any>;
  player?: Player;
}
