const { exec } = require("child_process");
const si = require('systeminformation');
const barg = process.argv.slice(2);
const barged = barg.toString().toLowerCase();
const os = require("os");
const chalk = require('chalk');

const date_ob = new Date();
const date = ("0" + date_ob.getDate()).slice(-2);
const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
const year = date_ob.getFullYear();
const hours = date_ob.getHours() > 12 ? date_ob.getHours() -12 : date_ob.getHours();
const minutes = date_ob.getMinutes() < 10 ? '0' + date_ob.getMinutes() : date_ob.getMinutes();
const seconds = date_ob.getSeconds();

/////////////////////////////////////////////////////////////////////////////////////////

const nets = os.networkInterfaces();
const results = Object.create(null); // or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }

            results[name].push(net.address);
        }
    }
}

const res = JSON.stringify(results) 
const stripFront = res.split('"')[3]

/////////////////////////////////////////////////////////////////////////////////////////


const countdown = (s) => {
    const d = Math.floor(s / (3600 * 24));
        s  -= d * 3600 * 24;
    const h   = Math.floor(s / 3600);
        s  -= h * 3600;
    const m = Math.floor(s / 60);
        s  -= m * 60;
    const tmp = [];
        (d) && tmp.push(d + 'D');
        (d || h) && tmp.push(h + 'H');
        (d || h || m) && tmp.push(m + 'M');
        tmp.push(s + 'S');
        return tmp.join(' ');
  }

const uptimeTotal = countdown(require('os').uptime())


//////////////////////////////////////////////////////////////////////////////////////////

const truncate = (input, len) => {
    if (input.length > len) {
       return input.substring(0, len) + '...';
    }
    return input;
 };

///////////////////////////////////////////////////////////////////////////////////////////

const hasBasic = () => {
    p('','~ __________________________________________________________________________');
    p('','|      ');p('white','~_   __   ____     ____     ______    ');
    p('','|     ');p('white','~/ | / /  / __ \\   / __ \\   / ____/       \\ ' + process.version +' | '+stripFront);
    p('','|    ');p('white','~/  |/ /  / / / /  / / / /  / __/           \\ DIR: ' + truncate(__dirname, 14));
    p('','|   ');p('white','~/ /|  /  / /_/ /  / /_/ /  / /__     /   /\\  \\ UPTIME: ' + uptimeTotal);
    p('','|  ');p('white','~/_/ |_/   \\____/  /_____/  /_____/  \\/  \\/     \\ '+date+'-'+month+'-'+year +' | '+hours+':'+minutes + (date_ob.getHours() > 12 ? ' AM' : ' PM' ))
    p('','~|__________________________________________________________________________')
}

///////////////////////////////////////////////////////////////////////////////////////////
// list all information... as a list
const hasList = () => {
    p('','~|')
    p('brWhite','')
    p('##','~|  SYSTEM INFORMATION')
    p('','~|')
    p('','|     ');p('white','~NODE VERSION:               ' + process.version);
    p('','|     ');p('white','~CURRENT DATE:               '+date+'-'+month+'-'+year)
    p('','|     ');p('white','~CURRENT TIME:               '+hours+':'+minutes + (date_ob.getHours() > 12 ? ' AM' : ' PM' ))
    p('','|     ');p('white','~OS UPTIME:                  ' + uptimeTotal)
    p('','|     ');p('white','~SYM DIRECTORY:              ' + process.cwd());
    p('','|     ');p('white','~PUBLIC ADDRESS:             '+stripFront);
    p('','|     ');p('white','~SYSTEM TYPE:                ' + os.type())
    p('','|     ');p('white','~PLATFORM:                   ' + os.platform())
    p('','|     ');p('white','~TOTAL MEMORY:               ' + os.totalmem())
    p('','|     ');p('white','~ARCHITECTURE:               ' + os.arch())
    p('','|     ');p('white','~HOSTNAME:                   ' + os.hostname())
    p('','|     ');p('white','~VERSION:                    ' + os.version())

    si.cpu()
        .then(data => {
            
            p('','~|   __________________________________________________________')
            p('','|   ');p('##','~HARDWARE INFORMATION')
            p('','~|')
            p('','|     ');p('white','~CPU COUNT:                  ' + data.processors)
            p('','|     ');p('white','~CPU CORES:                  ' + data.cores)
            p('','|     ');p('white','~CPU BRAND:                  ' + truncate(data.brand, 50))
            p('','|     ');p('white','~CPU SPEED:                  ' + data.speed)
            p('','|     ');p('white','~L2 CACHE:                   ' + data.cache.l2)
            p('','|     ');p('white','~L3 CACHE:                   ' + data.cache.l3)
            p('','~|__________________________________________________________________________');

    }).catch(error => console.error(error));


    

}

///////////////////////////////////////////////////////////////////////////////////////////

const hasModules = () => {
    exec("yarn list --depth=0", (stderr, stdout, error) => {
        let module = stdout.split('─')    
        p('','~|')
            exec("yarn -v", (stderr, stdout, error) => {   
                p('','|  YARN VERSION: '+stdout)
                p('','~|__________________________________________________________________________');
            })
        p('','~|  TOTAL MODULES: '+module.length)
    })
}

///////////////////////////////////////////////////////////////////////////////////////////

const hasAllModules = () => {
    exec("npm list", (stderr, stdout, error) => {
        let module = stdout.split('--')
        
        p('','~|')
        p('','~|  TOTAL MODULES: '+module.length)
        p('','~|')
        p('','|')
                for(let i = 0; i < module.length ; i++){
                        let done = module[i].includes('Done in');
                        let ylist = module[i].includes(' list');
                        if(!done && !ylist){
                            p('','  '+module[i])
                        }   
                }
        p('','~') 
        p('','~|______________________________________________________________________') 

})
}

///////////////////////////////////////////////////////////////////////////////////////////

const hasHardware = () => {
    si.cpu()
        .then(data => {
            p('','~|')
            p('','~|')
            p('','~|  CPU COUNT:                  ' + data.processors)
            p('','~|  CPU CORES:                  ' + data.cores)
            p('','~|  CPU BRAND:                  ' + data.brand)
            p('','~|  CPU SPEED:                  ' + data.speed)
            p('','~|  L2 CACHE:                   ' + data.cache.l2)
            p('','~|  L3 CACHE:                   ' + data.cache.l3)
            p('','~|  NODE VERSION:               ' + process.version);
            p('','~|  CURRENT DATE:               '+date+'-'+month+'-'+year)
            p('','~|  CURRENT TIME:               '+hours+':'+minutes + (date_ob.getHours() > 12 ? ' PM' : ' AM' ))
            p('','~|  OS UPTIME:                  ' + uptimeTotal)
            p('','~|  SYM DIRECTORY:              ' + __dirname);
            p('','~|  REAL DIRECTORY:             C:\\Users\\shlep\\Documents\\Code');
            p('','~|  PUBLIC ADDRESS:             '+stripFront);
            p('','~|  SYSTEM TYPE:                ' + os.type())
            p('','~|  PLATFORM:                   ' + os.platform())
            p('','~|  TOTAL MEMORY:               ' + os.totalmem())
            p('','~|  ARCHITECTURE:               ' + os.arch())
            p('','~|  HOSTNAME:                   ' + os.hostname())
            p('','~|  VERSION:                    ' + os.version())
            p('','~|__________________________________________________________________________');

        }).catch(error => console.error(error));
}


const hasAll = () => {       
    hasBasic()
    hasList()
}

const hasManual = () => {
    p('#red','~ ____________________________________________________________________________________');
    p('#red','~|')
    p('#red','~|  CANHAS.JS ')
    p('#red','~|      Display information about the host machine, directories, network, ')
    p('#red','~|')
    p('#red','~|   USAGE:')
    p('#red','~|      node canhas [options]')
    p('#red','~|')
    p('#red','~|   OPTIONS:')
    p('#red','~|      ?                 Display this manual page')
    p('#red','~|      basic, (blank)    Display the default information')
    p('#red','~|      list, l           Display all information in a list format')
    p('#red','~|      all, a            Display all information in a more readable format')
    p('#red','~|      p                 Display the number of total installed packages')
    p('#red','~|      packages          Display a list of all installed packages')
    p('#red','~|____________________________________________________________________________________');
}

///////////////////////////////////////////////////////////////////////////////////////////

function p(chalkColor, msg){
    let n = msg.includes("~");
    if(n){
        let res = msg.replace("~", "");

        switch(chalkColor){
            case 'red':  {console.log(chalk.red(res));}; break;
            case 'green':{console.log(chalk.green(res));}; break;
            case 'white':{console.log(chalk.white(res));}; break;
            case 'grey':{console.log(chalk.gray(res));}; break;

            case '#':  {console.log(chalk.bold.blue(res.toUpperCase())); }; break;
            case '#red':  {console.log(chalk.bold.red(res.toUpperCase())); }; break;
            case '#green':  {console.log(chalk.bold.green(res.toUpperCase())); }; break;
            case '#white':  {console.log(chalk.bold.white(res.toUpperCase())); }; break;
            case '#grey':  {console.log(chalk.bold.gray(res.toUpperCase())); }; break;

            case 'brGrey': { console.log(chalk.gray('______________________________________________________________________'))}; break;
            case 'brWhite': { console.log(chalk.white('______________________________________________________________________'))}; break;
            case 'brRed': { console.log(chalk.red('______________________________________________________________________'))}; break;

            default:     { console.log(chalk.blue(res));}
        }
    }else{
        process.stdout.write(chalk.blue(msg));
    }   
}

///////////////////////////////////////////////////////////////////////////////////////////

switch(barged){
    case 'man':
    case 'manual':
    case '?':
    case 'information':
    case 'info':{ hasManual() }; break;

    case 'basic':{ hasBasic() }; break;

    case 'all':
    case 'a':{ hasAll() }; break;

    case 'list':
    case 'l':{ hasList() }; break;

    case 'p':{ hasModules() }; break;

    case 'packages':{ hasAllModules() }; break;

    default:{
        if(barg == ''){
            hasBasic();
        }else{
            p('','~')
            p('',"~ ERROR: '"+barg+"' is an unrecognized or incomplete command")
            p('','~')
            p('',"~ Use 'canhas info' for command usage and more information ")
        }
        
    }
}