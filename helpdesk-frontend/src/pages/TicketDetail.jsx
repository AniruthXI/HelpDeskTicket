// src/pages/TicketDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Clock, AlertCircle, CheckCircle, XCircle,
    MessageSquare, Paperclip, AlertTriangle
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ticketService } from '../services/api';
import { FileUpload } from '../components/tickets/FileUpload';
import { adminService } from "../services/api";

const StatusBadge = ({ status, onStatusChange }) => {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
        resolved: 'bg-green-100 text-green-800 border-green-200',
        closed: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const icons = {
        pending: Clock,
        in_progress: AlertCircle,
        resolved: CheckCircle,
        closed: XCircle
    };

    const Icon = icons[status];

    return (
        <div className="relative group">
            <button
                onClick={() => onStatusChange && onStatusChange(status)}
                className={`inline-flex items-center px-3 py-1 rounded-full border ${styles[status]} cursor-pointer`}
            >
                <Icon className="w-4 h-4 mr-1.5" />
                <span className="font-medium">
                    {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1)}
                </span>
            </button>
        </div>
    );
};

const PriorityBadge = ({ priority }) => {
    const styles = {
        low: 'bg-gray-100 text-gray-800 border-gray-200',
        medium: 'bg-blue-100 text-blue-800 border-blue-200',
        high: 'bg-orange-100 text-orange-800 border-orange-200',
        urgent: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-xs font-medium ${styles[priority]}`}>
            <AlertTriangle className="w-3 h-3 mr-1" />
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
    );
};

export const TicketDetail = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        const fetchTicketDetails = async () => {
            try {
                setLoading(true);
                const ticketData = await ticketService.getById(id);
                setTicket(ticketData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTicketDetails();
    }, [id]);

    const handleStatusChange = async (newStatus) => {
        try {
            const updatedTicket = await ticketService.update(id, { status: newStatus });
            setTicket(updatedTicket);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const updatedTicket = await ticketService.addComment(id, { content: newComment });
            setTicket(updatedTicket);
            setNewComment('');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto p-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <span>{error}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!ticket) return null;

    const handleFileUpload = async (formData) => {
        try {
            setLoading(true);
            const result = await ticketService.uploadAttachments(ticket._id, formData);
            console.log('Upload result:', result); // Debug log
    
            // อัพเดท ticket state ด้วยข้อมูลใหม่
            if (result) {
                setTicket(prevTicket => ({
                    ...prevTicket,
                    attachments: result.attachments || prevTicket.attachments
                }));
            }
        } catch (err) {
            console.error('File upload error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 space-y-6">
            {/* Ticket Header */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
                            <div className="mt-2 space-x-3">
                                <StatusBadge status={ticket.status} onStatusChange={handleStatusChange} />
                                <PriorityBadge priority={ticket.priority} />
                            </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                            <div>Created by {ticket.createdBy?.username}</div>
                            <div>{new Date(ticket.createdAt).toLocaleString()}</div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="prose max-w-none">
                            <p className="text-gray-700">{ticket.description}</p>
                        </div>
                    </div>

                    {ticket.contact_info && (
                        <div className="mt-4 text-sm text-gray-600">
                            <strong>Contact:</strong> {ticket.contact_info}
                        </div>
                    )}
                </div>
            </div>

            {/* Comments Section */}
            <Card>
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Comments</h2>

                    {/* Add Comment Form */}
                    <form onSubmit={handleAddComment} className="mb-6">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                        />
                        <div className="mt-2 flex justify-end">
                            <Button type="submit" disabled={!newComment.trim()}>
                                Add Comment
                            </Button>
                        </div>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-4">
                        {ticket.comments?.map((comment) => (
                            <div key={comment._id} className="border-b border-gray-200 pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="font-medium text-gray-900">
                                        {comment.user.username}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </div>
                                </div>
                                <div className="mt-2 text-gray-700">
                                    {comment.content}
                                </div>
                            </div>
                        ))}

                        {(!ticket.comments || ticket.comments.length === 0) && (
                            <div className="text-center text-gray-500 py-4">
                                No comments yet
                            </div>
                        )}
                    </div>
                </div>
                // เพิ่มส่วน UI สำหรับแสดงไฟล์แนบและ upload
                <Card>
                    <div className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Attachments</h2>

                        <FileUpload onUpload={handleFileUpload} />

                        {ticket.attachments && ticket.attachments.length > 0 && (
                            <div className="mt-6 space-y-2">
                                {ticket.attachments.map((file) => (
                                    <div key={file._id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                        <div className="flex items-center space-x-2">
                                            <File className="h-4 w-4 text-gray-500" />
                                            <span className="text-sm text-gray-700">{file.filename}</span>
                                            <span className="text-xs text-gray-500">
                                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                            </span>
                                        </div>
                                        <a
                                            href={`/api/tickets/${ticket._id}/attachments/${file._id}`}
                                            className="text-blue-600 hover:text-blue-700 text-sm"
                                            download
                                        >
                                            Download
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>
            </Card>
        </div>
    );
};

export default TicketDetail;