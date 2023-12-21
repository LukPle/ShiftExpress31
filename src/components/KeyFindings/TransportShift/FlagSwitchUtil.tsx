export const getFlagProperty = (stateName: string) => {
    let flagUrl: string;
    
    switch (stateName) {
        case 'Baden-Württemberg':
            flagUrl = '/state-flags/flag_baden-wuerttemberg.png';
            break;
        case 'Bayern':
            flagUrl = '/state-flags/flag_bavaria.png';
            break;
        case 'Berlin':
            flagUrl = '/state-flags/flag_berlin.png';
            break;
        case 'Brandenburg':
            flagUrl = '/state-flags/flag_brandenburg.png';
            break;
        case 'Bremen':
            flagUrl = '/state-flags/flag_bremen.png';
            break;
        case 'Hamburg':
            flagUrl = '/state-flags/flag_hamburg.png';
            break;
        case 'Hessen':
            flagUrl = '/state-flags/flag_hesse.png';
            break;
        case 'Mecklenburg-Vorpommern':
            flagUrl = '/state-flags/flag_mecklenburg-vorpommern.png';
            break;
        case 'Niedersachsen':
            flagUrl = '/state-flags/flag_lower-saxony.png';
            break;
        case 'Nordrhein-Westfalen':
            flagUrl = '/state-flags/flag_north-rhine-westphalia.png';
            break;
        case 'Rheinland-Pfalz':
            flagUrl = '/state-flags/flag_rhineland-palatinate.png';
            break;
        case 'Saarland':
            flagUrl = '/state-flags/flag_saarland.png';
            break;
        case 'Sachsen':
            flagUrl = '/state-flags/flag_saxony.png';
            break;
        case 'Sachsen-Anhalt':
            flagUrl = '/state-flags/flag_saxony-anhalt.png';
            break;
        case 'Schleswig-Holstein':
            flagUrl = '/state-flags/flag_schleswig-holstein.png';
            break;
        case 'Thüringen':
            flagUrl = '/state-flags/flag_thuringia.png';
            break;
        default:
            // Default case if none of the above matches
            flagUrl = '/state-flags/flag_default.png';
    }

    return flagUrl;
};

