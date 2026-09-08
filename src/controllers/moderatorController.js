const moderatorService = require('../services/moderatorService');

const getReports = async (req, res) => {
  try {
    const reports = await moderatorService.getReports();
    res.status(200).json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;
    const report = await moderatorService.resolveReport(reportId, status);
    res.status(200).json({ success: true, message: "Report status updated", data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeInappropriateContent = async (req, res) => {
  try {
    const { contentType, contentId } = req.params;
    await moderatorService.deleteContent(contentType, contentId);
    res.status(200).json({ success: true, message: `${contentType} deleted successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const suspendUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isBanned } = req.body;
    const user = await moderatorService.toggleUserSuspension(userId, isBanned);
    res.status(200).json({ 
      success: true, 
      message: isBanned ? "User suspended successfully" : "User unsuspended successfully", 
      data: user 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getReports,
  updateReportStatus,
  removeInappropriateContent,
  suspendUser
};