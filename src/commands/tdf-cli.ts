import { GluegunCommand } from 'gluegun';
import { environment } from '../../project-info';

const command: GluegunCommand = {
  name: 'tdf-cli',
  run: async (toolbox) => {
    const { print } = toolbox;
    print.info("            ###########               ")         
    print.info("         ##################           ")         
    print.info("       #######################        ")         
    print.info("     ########     ##############      ")         
    print.info("   ##########            ########     ")         
    print.info(" ###########                  ####    ")         
    print.info(" ####        ####              ####   ")         
    print.info(" ####        ##########        ####   ")         
    print.info(" ####        ##########        #####  ")         
    print.info(" ####        ###########       #####  ")         
    print.info(" ####          ##########      ####   ")         
    print.info(" ####                  ##      ####   ")         
    print.info("  #####                ############   ")         
    print.info("   ##########          ##########     ")         
    print.info("     ##########################       ")         
    print.info("       ######################  "+ environment.description)              
    print.info("         ################      Versão: " + environment.version)      
    print.info("                               Powered by TOTVS SC") 
  },
};

export default command;
