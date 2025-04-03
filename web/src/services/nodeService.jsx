export const NodeService = {
    getTreeNodesData(navigate) {
        return [
            {
                key: '0',
                label: 'Opciones',
                data: 'Documents Folder',
                icon: 'pi pi-fw pi-home',
                children: [
                    {
                        key: '0-0',
                        label: 'Monitorear',
                        icon: 'pi pi-fw pi-cog',
                        command: () => {
                            navigate('/home/monitorear');
                        }
                    },
                    {
                        key: '0-1',
                        label: 'Administrar',
                        icon: 'pi pi-fw pi-cog',
                        command: () => {
                            navigate('/home/administrar');
                        }
                    }
                ]
            },
        ];
    },

    getTreeNodes(navigate) {
        return Promise.resolve(this.getTreeNodesData(navigate));
    }
};
