import { GluegunCommand } from 'gluegun';

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
    print.info("       ######################  TOTVS Developer Framework CLI")              
    print.info("         ################      Versão: 1.0.15")      
    print.info("                               Powered by TOTVS SC") 
  },
};

export default command;
