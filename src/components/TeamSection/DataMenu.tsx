import React from 'react';
import { Dropdown, ListDivider, Menu, MenuButton, MenuItem } from "@mui/joy";
import { DirectionsCarRounded, DnsRounded, GroupRounded, TrainRounded } from '@mui/icons-material';

interface DataMenuProps {
    // 
}

const DataMenu: React.FC<DataMenuProps> = ({}) => {
    const handleMenuItemClick = (url: string) => {
        window.open(url, '_blank');
    };

    return (
        <Dropdown>
        <MenuButton startDecorator={<DnsRounded />} sx={{ mt: "30px", minWidth: '190px', maxHeight: '36px' }}>Data Sources</MenuButton>
        <Menu placement="bottom-start">
            <MenuItem onClick={() => handleMenuItemClick('https://www-genesis.destatis.de/genesis//online?operation=table&code=46181-0010&bypass=true&levelindex=1&levelid=1706999120933#abreadcrumb')}>
                <TrainRounded />
                Public Transportation Data
            </MenuItem>
            <ListDivider />
            <MenuItem onClick={() => handleMenuItemClick('https://www.check24.de/files/p/2015/2/5/e/5981-2015-03-16_check24_praesentation_fahrleistung.pdf')}>
                <DirectionsCarRounded />
                Car Data 2013 and 2014
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('https://www.check24.de/files/p/2017/d/5/8/10635-2017_02_07_check24_praesentation_fahrleistung_bundesland.pdf')}>
                <span style={{ display: 'inline-block', width: '20px' }}></span> {/* Icon container */}
                Car Data 2015 and 2016
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('https://www.check24.de/files/p/2018/1/b/e/12499-2018-02-19_check24_studie_durchschnittliche-fahrleistung.pdf')}>
                <span style={{ display: 'inline-block', width: '20px' }}></span> {/* Icon container */}
                Car Data 2017
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('https://m.check24.de/unternehmen/presse/pressemitteilungen/mecklenburg-vorpommern-legen-die-meisten-kilometer-mit-dem-auto-zurueck-1126/')}>
                <span style={{ display: 'inline-block', width: '20px' }}></span> {/* Icon container */}
                Car Data 2018
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('https://www.check24.de/unternehmen/presse/pressemitteilungen/mecklenburg-vorpommern-legen-die-meisten-kilometer-mit-dem-auto-zurueck-1356/')}>
                <span style={{ display: 'inline-block', width: '20px' }}></span> {/* Icon container */}
                Car Data 2019
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('https://www.check24.de/unternehmen/presse/pressemitteilungen/kfz-versicherung:-meiste-gefahrene-kilometer-in-mecklenburg-vorpommern-1567/')}>
                <span style={{ display: 'inline-block', width: '20px' }}></span> {/* Icon container */}
                Car Data 2020
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('https://www.check24.de/unternehmen/presse/pressemitteilungen/kfz-versicherung:-in-mecklenburg-vorpommern-fahren-autos-am-weitesten-1799/')}>
                <span style={{ display: 'inline-block', width: '20px' }}></span> {/* Icon container */}
                Car Data 2021
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('https://www.check24.de/unternehmen/presse/pressemitteilungen/in-deutschland-sind-kfz-halter*innen-im-schnitt-11.085-kilometer-p.-a.-unterwegs-2059/')}>
                <span style={{ display: 'inline-block', width: '20px' }}></span> {/* Icon container */}
                Car Data 2022
            </MenuItem>
            <ListDivider />
            <MenuItem onClick={() => handleMenuItemClick('https://www-genesis.destatis.de/genesis//online?operation=table&code=12111-0101&bypass=true&levelindex=0&levelid=1706623578738#abreadcrumb')}>
                <GroupRounded />
                Population Data
            </MenuItem>
        </Menu>
        </Dropdown>
    );
};

export default DataMenu;
