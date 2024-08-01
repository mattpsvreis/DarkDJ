import { CommandInteraction } from "discord.js";
import ExtendedClient from "./extended-client";

type CommandProps = {
  client: ExtendedClient;
  interaction: CommandInteraction;
};

export default CommandProps;
