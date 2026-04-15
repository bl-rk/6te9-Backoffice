import React, { useState, useEffect } from 'react';
import { ShoppingCart, Edit, Eye, Filter, Plus, FileText, Share2, Trash2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
    UNPAID = 'UNPAID',
    PAID = 'PAID',
    REFUNDED = 'REFUNDED'
}

export interface OrderItem {
    itemId: string;
    itemTitle?: string;
    itemDescription?: string;
    quantity: number;
    priceAtPurchase: number;
    selectedSpecs: { key: string; value: string }[];
}

export interface Order {
    id: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    shippingAddress: string;
    createdAt: string;
    updatedAt: string;
}

const MOCK_ORDERS: Order[] = [
    { id: 'ORD-10492', customerId: 'CUS-001', customerName: 'Alice Johnson', customerEmail: 'alice@example.com', customerPhone: '+234 801 234 1111', totalAmount: 450000, status: OrderStatus.PENDING, paymentStatus: PaymentStatus.UNPAID, items: [{ itemId: 'ITEM-891', quantity: 1, priceAtPurchase: 450000, selectedSpecs: [] }], shippingAddress: '123 Victoria Island, Lagos', createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), updatedAt: new Date().toISOString() },
    { id: 'ORD-10491', customerId: 'CUS-002', customerName: 'Bob Smith', customerEmail: 'bob@example.com', customerPhone: '+234 802 345 2222', totalAmount: 1250000, status: OrderStatus.CONFIRMED, paymentStatus: PaymentStatus.PAID, items: [{ itemId: 'ITEM-832', quantity: 2, priceAtPurchase: 625000, selectedSpecs: [] }], shippingAddress: '45 Lekki Phase 1, Lagos', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), updatedAt: new Date().toISOString() },
    { id: 'ORD-10490', customerId: 'CUS-003', customerName: 'Charlie Tech', customerEmail: 'charlie@example.com', customerPhone: '+234 813 456 3333', totalAmount: 45000, status: OrderStatus.SHIPPED, paymentStatus: PaymentStatus.PAID, items: [{ itemId: 'ITEM-112', quantity: 1, priceAtPurchase: 45000, selectedSpecs: [] }], shippingAddress: '90 Ikeja, Lagos', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), updatedAt: new Date().toISOString() },
];

import GenericModal from './modals/GenericModal';
import { inventoryService } from '../services/inventoryService';
import { BaseItem } from '../types';

const OrdersManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
    const [filterStatus, setFilterStatus] = useState<OrderStatus | 'ALL'>('ALL');
    const [filterSearch, setFilterSearch] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [newOrder, setNewOrder] = useState<Partial<Order>>({ status: OrderStatus.PENDING, paymentStatus: PaymentStatus.UNPAID, items: [] });
    const [inventoryItems, setInventoryItems] = useState<BaseItem[]>([]);
    const [selectedCatalogItem, setSelectedCatalogItem] = useState<string>('');
    const [itemQuantity, setItemQuantity] = useState<number>(1);

    useEffect(() => {
        inventoryService.getAllItems().then(items => setInventoryItems(items));
    }, []);

    const generateReceipt = (order: Order, share: boolean = false) => {
        const logoSvgRaw = `<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 146.9 212.4" style="enable-background:new 0 0 146.9 212.4;"><style type="text/css">.st0{fill:url(#SVGID_1_);}.st1{enable-background:new    ;}.st2{fill:#231F20;}</style><g id="Layer_2_1_"><g id="OBJECTS"><path d="M86.9,84.9c15.7,17.4-1,50.6-30.3,58.5c34.6,12.9,73.2-4.8,86-39.4c7.5-20.3,4.8-43-7.4-60.9 c-8.1-11.6-19.6-20.5-32.9-25.4l-0.6-0.2l0,0C100.5,17.9,42.8,36,86.9,84.9z"/><linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="7.596199e-03" y1="148.4694" x2="88.79" y2="148.4694" gradientTransform="matrix(1 0 0 -1 0 213)"><stop  offset="0" style="stop-color:#A1A1A1"/><stop  offset="1" style="stop-color:#6A6A6A"/></linearGradient><path class="st0" d="M29.3,11C-1.3,31.8-9.2,73.4,11.6,104c7.8,11.5,19,20.3,32,25.1c29.3-7.9,46-41.1,30.3-58.5 c-44.2-49,13.5-67,14.8-67.4C84.2,1.6,54.7-6.3,29.3,11z"/><g class="st1"><path class="st2" d="M56.1,195.1c0,1.3-0.2,2.5-0.7,3.6c-0.5,1.1-1.1,2.1-1.9,3c-0.8,0.8-1.7,1.5-2.8,2c-1.1,0.5-2.3,0.7-3.6,0.7 s-2.5-0.2-3.6-0.7c-1.1-0.5-2.1-1.2-3-2c-0.8-0.8-1.5-1.8-2-3c-0.5-1.1-0.7-2.3-0.7-3.6c0-1.5,0.1-3,0.4-4.4 c0.3-1.4,0.7-2.8,1.3-4.1c0.6-1.3,1.3-2.5,2.1-3.6c0.8-1.1,1.7-2,2.8-2.8h6.3c-0.7,0.4-1.3,0.9-1.9,1.4c-0.6,0.5-1.2,1.1-1.8,1.7 s-1.1,1.2-1.6,1.9c-0.5,0.7-0.9,1.4-1.3,2.1c0.5-0.3,1-0.6,1.5-0.8s1.1-0.3,1.7-0.3c1.3,0,2.5,0.2,3.6,0.7c1.1,0.4,2,1.1,2.7,1.9 s1.3,1.7,1.7,2.8C55.9,192.6,56.1,193.8,56.1,195.1z M51.4,195.1c0-0.6-0.1-1.2-0.3-1.8s-0.5-1-0.9-1.5c-0.4-0.4-0.8-0.8-1.3-1 c-0.5-0.2-1.1-0.4-1.8-0.4s-1.2,0.1-1.8,0.4c-0.5,0.2-1,0.6-1.3,1c-0.4,0.4-0.6,0.9-0.8,1.5s-0.3,1.1-0.3,1.8 c0,0.6,0.1,1.2,0.3,1.7c0.2,0.6,0.5,1,0.9,1.5c0.4,0.4,0.8,0.8,1.3,1c0.5,0.3,1.1,0.4,1.7,0.4c0.6,0,1.2-0.1,1.8-0.4 c0.5-0.2,1-0.6,1.3-1c0.4-0.4,0.7-0.9,0.9-1.5C51.3,196.3,51.4,195.7,51.4,195.1z"/><path class="st2" d="M67.7,203.7c-1.1,0-2.1-0.2-3.1-0.6c-1-0.4-1.8-1-2.5-1.7c-0.7-0.7-1.3-1.6-1.7-2.5s-0.6-2-0.6-3.1v-5.2 h-2.2v-4.5h2.2v-7h4.5v7h6.8v4.5h-6.8v5.2c0,0.5,0.1,0.9,0.3,1.3c0.2,0.4,0.4,0.8,0.7,1.1c0.3,0.3,0.7,0.6,1.1,0.7 s0.9,0.3,1.3,0.3h3.4v4.5H67.7z"/><path class="st2" d="M80.6,199.4c0.2,0.1,0.3,0.1,0.5,0.1c0.2,0,0.3,0,0.5,0c0.4,0,0.9-0.1,1.3-0.2c0.4-0.1,0.8-0.3,1.1-0.5 s0.7-0.5,1-0.8c0.3-0.3,0.5-0.7,0.7-1.1l3.3,3.3c-0.4,0.6-0.9,1.1-1.4,1.6c-0.5,0.5-1.1,0.9-1.8,1.2c-0.6,0.3-1.3,0.6-2,0.7 c-0.7,0.2-1.4,0.3-2.1,0.3c-1.2,0-2.4-0.2-3.5-0.7s-2-1.1-2.9-1.9c-0.8-0.8-1.5-1.8-1.9-2.9c-0.5-1.1-0.7-2.4-0.7-3.7 c0-1.4,0.2-2.7,0.7-3.8s1.1-2.1,1.9-2.9c0.8-0.8,1.8-1.4,2.9-1.9c1.1-0.4,2.3-0.7,3.5-0.7c0.7,0,1.4,0.1,2.1,0.3 c0.7,0.2,1.4,0.4,2,0.8c0.6,0.3,1.2,0.7,1.8,1.2c0.5,0.5,1,1,1.4,1.6L80.6,199.4z M82.9,190.2c-0.2-0.1-0.4-0.1-0.6-0.1 c-0.2,0-0.4,0-0.6,0c-0.6,0-1.2,0.1-1.7,0.3c-0.5,0.2-1,0.5-1.4,1c-0.4,0.4-0.7,0.9-0.9,1.5c-0.2,0.6-0.3,1.2-0.3,2 c0,0.2,0,0.3,0,0.6c0,0.2,0,0.4,0.1,0.6c0,0.2,0.1,0.4,0.1,0.6s0.1,0.4,0.2,0.5L82.9,190.2z"/><path class="st2" d="M109,188.9c0,1.5-0.2,3-0.5,4.4c-0.3,1.4-0.7,2.8-1.3,4.1c-0.6,1.3-1.3,2.5-2.1,3.5c-0.8,1.1-1.7,2-2.8,2.8 H96c0.7-0.4,1.3-0.9,1.9-1.4c0.6-0.5,1.2-1.1,1.8-1.7c0.6-0.6,1.1-1.2,1.6-1.9c0.5-0.7,0.9-1.4,1.3-2.1c-0.5,0.3-1,0.6-1.5,0.8 s-1.1,0.3-1.7,0.3c-1.3,0-2.5-0.2-3.6-0.7c-1.1-0.4-2-1.1-2.7-1.9s-1.3-1.7-1.7-2.8c-0.4-1.1-0.6-2.3-0.6-3.6 c0-1.3,0.2-2.5,0.7-3.6c0.5-1.1,1.1-2.1,1.9-3c0.8-0.8,1.7-1.5,2.8-2c1.1-0.5,2.3-0.7,3.6-0.7c1.3,0,2.5,0.2,3.6,0.7s2.1,1.2,3,2 c0.8,0.8,1.5,1.8,2,3S109,187.6,109,188.9z M104,188.9c0-0.6-0.1-1.2-0.3-1.7c-0.2-0.6-0.5-1-0.9-1.5c-0.4-0.4-0.8-0.8-1.4-1 c-0.5-0.3-1.1-0.4-1.7-0.4c-0.6,0-1.2,0.1-1.7,0.4c-0.5,0.2-1,0.6-1.3,1c-0.4,0.4-0.7,0.9-0.9,1.5c-0.2,0.6-0.3,1.2-0.3,1.8 c0,0.6,0.1,1.2,0.3,1.8c0.2,0.6,0.5,1,0.9,1.5c0.4,0.4,0.8,0.7,1.3,1s1.1,0.4,1.7,0.4c0.6,0,1.2-0.1,1.8-0.4s1-0.6,1.4-1 s0.7-0.9,0.9-1.5C103.9,190.1,104,189.5,104,188.9z"/></g></g></g></svg>`;

        const executePDF = (imgData?: string) => {
            const doc = new jsPDF();

            if (imgData) {
                // width/height aspects matched to the SVG 146x212 => ~10x15
                doc.addImage(imgData, 'PNG', 14, 15, 10, 14.5);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(28);
                doc.setTextColor(0, 0, 0);
                // doc.text('TE9 LTD', 26, 26);
            } else {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(28);
                doc.setTextColor(0, 0, 0);
                doc.text('6TE9 LTD', 14, 24);
            }

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text('Official Sales Invoice & Receipt', 14, 34);

            // Metadata block
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.text(`Order ID: ${order.id}`, 14, 44);
            doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 50);
            doc.text(`Customer: ${order.customerName}`, 14, 56);
            doc.text(`Contact: ${order.customerEmail} | ${order.customerPhone}`, 14, 62);
            doc.text(`Status: ${order.status}`, 14, 68);

            const tableData = order.items.map(i => [
                i.itemTitle || i.itemId,
                i.itemDescription || 'Standard Fulfillment Item',
                i.quantity,
                `N${i.priceAtPurchase.toLocaleString()}`,
                `N${(i.quantity * i.priceAtPurchase).toLocaleString()}`
            ]);

            autoTable(doc, {
                startY: 76,
                head: [['Item Name', 'Description', 'Qty', 'Unit Price', 'Line Total']],
                body: tableData,
                theme: 'striped',
                headStyles: { fillColor: [0, 0, 0] }
            });

            // Accounting Computation 
            const finalY = (doc as any).lastAutoTable.finalY || 76;
            const subTotal = order.totalAmount;
            const autoTax = subTotal * 0.075; // 7.5% dummy VAT standard
            const grossTotal = subTotal + autoTax;

            doc.setFontSize(10);
            doc.text(`Subtotal: N${subTotal.toLocaleString()}`, 140, finalY + 12, { align: 'right' });
            doc.text(`Auto Tax (7.5% VAT): N${autoTax.toLocaleString()}`, 140, finalY + 18, { align: 'right' });

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(`Total Amount: N${grossTotal.toLocaleString()}`, 140, finalY + 28, { align: 'right' });

            if (share && navigator.canShare) {
                try {
                    const pdfBlob = doc.output('blob');
                    const file = new File([pdfBlob], `receipt_${order.id}.pdf`, { type: 'application/pdf' });
                    navigator.share({
                        files: [file],
                        title: `Receipt for ${order.id}`
                    });
                    return;
                } catch (err) {
                    console.warn('Share not supported', err);
                }
            }

            doc.save(`receipt_${order.id}.pdf`);
        };

        try {
            const img = new Image();
            const svgBlob = new Blob([logoSvgRaw], { type: 'image/svg+xml;charset=utf-8' });
            // Type cast to any to bypass strict window DOM typing
            const DOMURL = (window as any).URL || (window as any).webkitURL || window;
            const url = DOMURL.createObjectURL(svgBlob);

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 146 * 3;
                canvas.height = 212 * 3;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                DOMURL.revokeObjectURL(url);
                executePDF(canvas.toDataURL('image/png'));
            };
            img.onerror = () => executePDF();
            img.src = url;

        } catch {
            executePDF();
        }
    };

    const filteredOrders = orders.filter(o =>
        (filterStatus === 'ALL' || o.status === filterStatus) &&
        (o.id.toLowerCase().includes(filterSearch.toLowerCase()) || o.customerName.toLowerCase().includes(filterSearch.toLowerCase()))
    );

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING: return 'bg-amber-100 text-amber-800 border-amber-200';
            case OrderStatus.CONFIRMED: return 'bg-blue-100 text-blue-800 border-blue-200';
            case OrderStatus.SHIPPED: return 'bg-purple-100 text-purple-800 border-purple-200';
            case OrderStatus.DELIVERED: return 'bg-green-100 text-green-800 border-green-200';
            case OrderStatus.CANCELLED: return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-zinc-100 text-zinc-800 border-zinc-200';
        }
    };

    const getPaymentColor = (status: PaymentStatus) => {
        switch (status) {
            case PaymentStatus.PAID: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case PaymentStatus.UNPAID: return 'bg-rose-50 text-rose-700 border-rose-200';
            case PaymentStatus.REFUNDED: return 'bg-zinc-100 text-zinc-700 border-zinc-200';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Order Logistics</h2>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Manage processing, fulfillment, and shipping</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setIsCreatingOrder(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-bold shadow-md hover:bg-zinc-800 transition-colors w-full md:w-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Create Order
                    </button>
                    <input
                        type="text"
                        placeholder="Search IDs or Names..."
                        className="px-4 py-2 border border-zinc-200 rounded-lg text-sm font-bold w-full md:w-auto outline-none focus:ring-1 focus:ring-black"
                        value={filterSearch}
                        onChange={(e) => setFilterSearch(e.target.value)}
                    />
                    <select
                        className="px-4 py-2 border border-zinc-200 rounded-lg text-[10px] font-black uppercase tracking-widest bg-white outline-none cursor-pointer"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'ALL')}
                    >
                        <option value="ALL">ALL STATUSES</option>
                        {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50/50">
                                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Order ID</th>
                                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Customer</th>
                                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Amount & Items</th>
                                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Payment</th>
                                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Fulfillment</th>
                                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="group hover:bg-zinc-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500">
                                                <ShoppingCart className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-black">{order.id}</p>
                                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-black">{order.customerName}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-black text-black">₦{order.totalAmount.toLocaleString()}</p>
                                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">{order.items.length} Items</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest border ${getPaymentColor(order.paymentStatus)}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-400 text-sm font-medium">
                                        No orders matching filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedOrder && (
                <GenericModal
                    isOpen={!!selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    title={`Order Details: ${selectedOrder.id}`}
                    width="max-w-2xl"
                >
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl flex flex-col gap-2">
                                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Customer Details</p>
                                <input
                                    type="text"
                                    placeholder="Customer Name"
                                    className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:ring-1 focus:ring-black"
                                    value={selectedOrder.customerName}
                                    onChange={(e) => {
                                        const updated = { ...selectedOrder, customerName: e.target.value };
                                        setSelectedOrder(updated);
                                        setOrders(orders.map(o => o.id === updated.id ? updated : o));
                                    }}
                                />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs font-medium outline-none focus:ring-1 focus:ring-black"
                                    value={selectedOrder.customerEmail}
                                    onChange={(e) => {
                                        const updated = { ...selectedOrder, customerEmail: e.target.value };
                                        setSelectedOrder(updated);
                                        setOrders(orders.map(o => o.id === updated.id ? updated : o));
                                    }}
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone / Mobile"
                                    className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs font-medium outline-none focus:ring-1 focus:ring-black"
                                    value={selectedOrder.customerPhone}
                                    onChange={(e) => {
                                        const updated = { ...selectedOrder, customerPhone: e.target.value };
                                        setSelectedOrder(updated);
                                        setOrders(orders.map(o => o.id === updated.id ? updated : o));
                                    }}
                                />
                                <p className="text-[10px] font-medium tracking-tight text-zinc-500 mt-1">{selectedOrder.customerId}</p>
                            </div>
                            <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl flex flex-col gap-2">
                                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Logistics & Ship To</p>
                                <textarea
                                    className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs font-medium outline-none focus:ring-1 focus:ring-black resize-none h-16"
                                    value={selectedOrder.shippingAddress}
                                    onChange={(e) => {
                                        const updated = { ...selectedOrder, shippingAddress: e.target.value };
                                        setSelectedOrder(updated);
                                        setOrders(orders.map(o => o.id === updated.id ? updated : o));
                                    }}
                                />
                            </div>
                        </div>

                        <div className="bg-white border border-zinc-200 p-4 rounded-2xl shadow-sm">
                            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-3 px-1">Order Items</p>
                            <div className="space-y-3">
                                {selectedOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                                        <div>
                                            <p className="text-xs font-black">{item.itemId}</p>
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mt-0.5">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-xs font-black">₦{item.priceAtPurchase.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-zinc-100 mt-4 pt-4 flex justify-between items-center px-1">
                                <p className="text-xs font-black uppercase tracking-widest">Total Amount</p>
                                <p className="text-lg font-black italic tracking-tighter">₦{selectedOrder.totalAmount.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pb-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Order Status</label>
                                <select
                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all appearance-none cursor-pointer"
                                    value={selectedOrder.status}
                                    onChange={(e) => {
                                        const updatedOrder = { ...selectedOrder, status: e.target.value as OrderStatus };
                                        setSelectedOrder(updatedOrder);
                                        setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
                                    }}
                                >
                                    {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Payment Status</label>
                                <select
                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all appearance-none cursor-pointer"
                                    value={selectedOrder.paymentStatus}
                                    onChange={(e) => {
                                        const updatedOrder = { ...selectedOrder, paymentStatus: e.target.value as PaymentStatus };
                                        setSelectedOrder(updatedOrder);
                                        setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
                                    }}
                                >
                                    {Object.values(PaymentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-zinc-100">
                            <button
                                onClick={() => generateReceipt(selectedOrder, false)}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                            >
                                <FileText className="w-4 h-4" />
                                Download Receipt
                            </button>
                            <button
                                onClick={() => generateReceipt(selectedOrder, true)}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-black hover:bg-zinc-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors shadow-md"
                            >
                                <Share2 className="w-4 h-4" />
                                Share PDF
                            </button>
                        </div>
                    </div>
                </GenericModal>
            )}

            {isCreatingOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCreatingOrder(false)} />
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const craftedOrder: Order = {
                                id: `ORD-${Math.floor(Math.random() * 90000) + 10000}`,
                                customerId: `CUS-${Math.floor(Math.random() * 900) + 100}`,
                                customerName: newOrder.customerName || 'Walk-in Customer',
                                customerEmail: newOrder.customerEmail || '',
                                customerPhone: newOrder.customerPhone || '',
                                shippingAddress: newOrder.shippingAddress || '',
                                totalAmount: Number(newOrder.totalAmount) || 0,
                                status: newOrder.status as OrderStatus || OrderStatus.PENDING,
                                paymentStatus: newOrder.paymentStatus as PaymentStatus || PaymentStatus.UNPAID,
                                items: newOrder.items && newOrder.items.length > 0 ? newOrder.items : [{ itemId: 'MANUAL-ITEM', itemTitle: 'Custom Manual Entry', itemDescription: 'Ingested offline manual purchase', quantity: 1, priceAtPurchase: Number(newOrder.totalAmount) || 0, selectedSpecs: [] }],
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString()
                            };
                            setOrders([craftedOrder, ...orders]);
                            setIsCreatingOrder(false);
                            setNewOrder({ status: OrderStatus.PENDING, paymentStatus: PaymentStatus.UNPAID, items: [] });
                        }}
                        className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 border border-zinc-200 overflow-hidden"
                    >
                        <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between">
                            <h3 className="text-xl font-black italic uppercase tracking-tighter">Manual Order Ingestion</h3>
                            <button type="button" onClick={() => setIsCreatingOrder(false)} className="p-2 hover:bg-zinc-100 rounded-xl transition-all"><span className="text-xs font-bold leading-none align-middle block w-4 h-4 text-center">✕</span></button>
                        </div>

                        <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Customer Full Name</label>
                                    <input required placeholder="E.g. John Doe" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black" value={newOrder.customerName || ''} onChange={e => setNewOrder({ ...newOrder, customerName: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Mobile Contact</label>
                                    <input required type="tel" placeholder="+234..." className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black" value={newOrder.customerPhone || ''} onChange={e => setNewOrder({ ...newOrder, customerPhone: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Email Address</label>
                                <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black" value={newOrder.customerEmail || ''} onChange={e => setNewOrder({ ...newOrder, customerEmail: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Shipping Target Location</label>
                                <textarea required placeholder="Full physical address..." className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black h-20 resize-none" value={newOrder.shippingAddress || ''} onChange={e => setNewOrder({ ...newOrder, shippingAddress: e.target.value })} />
                            </div>

                            <div className="space-y-4 border-t border-zinc-100 pt-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Order Items Selection</p>

                                {newOrder.items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black">{item.itemTitle || item.itemId} (x{item.quantity})</span>
                                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{item.itemDescription}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-black italic">₦{(item.quantity * item.priceAtPurchase).toLocaleString()}</span>
                                            <button type="button" onClick={() => {
                                                const items = newOrder.items?.filter((_, i) => i !== idx);
                                                const newTotal = items?.reduce((sum, i) => sum + (i.quantity * i.priceAtPurchase), 0) || 0;
                                                setNewOrder({ ...newOrder, items, totalAmount: newTotal });
                                            }} className="p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}

                                <div className="flex gap-2 items-end bg-zinc-50 p-2 rounded-xl border border-zinc-100">
                                    <div className="flex-1 space-y-1">
                                        <label className="text-[8px] font-black uppercase text-zinc-400 px-1 tracking-widest">Select Catalog Item</label>
                                        <select
                                            className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold outline-none cursor-pointer"
                                            value={selectedCatalogItem}
                                            onChange={(e) => setSelectedCatalogItem(e.target.value)}
                                        >
                                            <option value="">-- Manual Value or Choose... --</option>
                                            {inventoryItems.map(item => (
                                                <option key={item.id} value={item.id}>{item.name} - ₦{item.price.toLocaleString()}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-20 space-y-1">
                                        <label className="text-[8px] font-black uppercase text-zinc-400 px-1 tracking-widest">Qty</label>
                                        <input type="number" min="1" value={itemQuantity} onChange={e => setItemQuantity(Number(e.target.value) || 1)} className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-lg text-xs font-bold outline-none" />
                                    </div>
                                    <button type="button" onClick={() => {
                                        const item = inventoryItems.find(i => i.id === selectedCatalogItem);
                                        if (!item) return;
                                        const newItem: OrderItem = { itemId: item.id, itemTitle: item.name, itemDescription: item.description || item.baseCategory, quantity: itemQuantity, priceAtPurchase: item.price, selectedSpecs: [] };
                                        const updatedItems = [...(newOrder.items || []), newItem];
                                        const updatedTotal = updatedItems.reduce((sum, i) => sum + (i.quantity * i.priceAtPurchase), 0);
                                        setNewOrder({ ...newOrder, items: updatedItems, totalAmount: updatedTotal });
                                        setSelectedCatalogItem('');
                                        setItemQuantity(1);
                                    }} className="px-4 py-2.5 bg-black text-white rounded-lg text-[10px] font-black uppercase transition-all shadow-md hover:bg-zinc-800">Add</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 border-t border-zinc-100 pt-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Value (₦)</label>
                                    <input required type="number" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black" value={newOrder.totalAmount || ''} onChange={e => setNewOrder({ ...newOrder, totalAmount: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Fulfillment</label>
                                    <select className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-[10px] font-bold outline-none appearance-none cursor-pointer" value={newOrder.status || OrderStatus.PENDING} onChange={e => setNewOrder({ ...newOrder, status: e.target.value as OrderStatus })}>
                                        {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Payment</label>
                                    <select className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-[10px] font-bold outline-none appearance-none cursor-pointer" value={newOrder.paymentStatus || PaymentStatus.UNPAID} onChange={e => setNewOrder({ ...newOrder, paymentStatus: e.target.value as PaymentStatus })}>
                                        {Object.values(PaymentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-zinc-100 flex gap-3 bg-zinc-50/50">
                            <button type="button" onClick={() => setIsCreatingOrder(false)} className="flex-1 py-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-colors">Cancel</button>
                            <button type="submit" className="flex-[2] py-4 bg-black hover:bg-zinc-800 text-white shadow-xl rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Generate Invoice</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default OrdersManagement;
