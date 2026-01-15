import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Truck,
    Settings,
    Trash2,
    Plus,
    ShieldCheck,
    AlertCircle,
    Wrench,
    Fuel,
    Activity,
    Navigation
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
    getVehicles,
    addVehicle
} from '@/lib/logistics-api';
import { toast } from 'sonner';

export default function LogisticsVehicles() {
    const [loading, setLoading] = useState(true);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newVehicle, setNewVehicle] = useState({
        vehicle_type: 'Medium Van',
        registration_number: '',
        capacity_kg: ''
    });

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        setLoading(true);
        try {
            const { data, error } = await getVehicles();
            if (error) throw error;
            setVehicles(data || []);
        } catch (error) {
            toast.error('Failed to load fleet data');
        } finally {
            setLoading(false);
        }
    };

    const handleAddVehicle = async () => {
        if (!newVehicle.registration_number || !newVehicle.capacity_kg) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            const { error } = await addVehicle({
                ...newVehicle,
                capacity_kg: parseFloat(newVehicle.capacity_kg)
            });

            if (error) throw error;
            toast.success('Vehicle added to fleet');
            setShowAddForm(false);
            setNewVehicle({ vehicle_type: 'Medium Van', registration_number: '', capacity_kg: '' });
            loadVehicles();
        } catch (error) {
            toast.error('Failed to add vehicle');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
                    <p className="text-muted-foreground text-lg">Manage your vehicles, track maintenance, and monitor fuel efficiency.</p>
                </div>
                <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Vehicle
                </Button>
            </div>

            {showAddForm && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-sm">Register New Vehicle</CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2">
                            <Label>Vehicle Type</Label>
                            <Input
                                placeholder="e.g. 5-Ton Truck"
                                value={newVehicle.vehicle_type}
                                onChange={(e) => setNewVehicle({ ...newVehicle, vehicle_type: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Registration Number</Label>
                            <Input
                                placeholder="LT-1234-XY"
                                value={newConfig.registration_number}
                                onChange={(e) => setNewVehicle({ ...newVehicle, registration_number: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Capacity (kg)</Label>
                            <Input
                                type="number"
                                placeholder="2000"
                                value={newVehicle.capacity_kg}
                                onChange={(e) => setNewVehicle({ ...newVehicle, capacity_kg: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleAddVehicle} className="flex-1">Register</Button>
                            <Button variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.length > 0 ? vehicles.map((vehicle) => (
                    <Card key={vehicle.id} className="group overflow-hidden hover:border-primary/50 transition-all">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-primary/10 transition-colors">
                                    <Truck className="h-6 w-6 text-slate-600 group-hover:text-primary" />
                                </div>
                                <Badge className={`${vehicle.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                    } border-none`}>
                                    {vehicle.status}
                                </Badge>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg font-bold">{vehicle.registration_number}</h3>
                                <p className="text-sm text-muted-foreground">{vehicle.vehicle_type}</p>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                        <Fuel className="h-3 w-3" />
                                        Capacity
                                    </div>
                                    <p className="text-sm font-bold">{vehicle.capacity_kg.toLocaleString()} kg</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                        <Activity className="h-3 w-3" />
                                        Efficiency
                                    </div>
                                    <p className="text-sm font-bold">94%</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                                <Button variant="ghost" size="sm" className="text-slate-500">
                                    <Navigation className="h-4 w-4 mr-2" />
                                    Track Live
                                </Button>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary">
                                        <Wrench className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )) : (
                    <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl space-y-4">
                        <Truck className="h-12 w-12 mx-auto text-slate-200" />
                        <div className="space-y-1">
                            <p className="font-bold text-slate-600">No vehicles registered</p>
                            <p className="text-sm text-slate-400">Add your first vehicle to start accepting deliveries.</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setShowAddForm(true)}>Add Vehicle</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
